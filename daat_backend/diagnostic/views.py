
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import WebhookSerializer, DiagnosticSerializer, AnalysisFeedbackSerializer
from django.conf import settings
from django.contrib.auth.models import User
from .models import Diagnostic, StartupOutcome, WebhookConfig
from .tasks import analyze_startup_task
from celery.result import AsyncResult
from .services import analyze_idea
from .services.market_research import Phase1MarketResearch
from .utils.openai_client import OpenAIClient
from .utils.tavily_client import TavilySearchClient
import threading
import json
import logging

logger = logging.getLogger(__name__)

# In-memory storage for task status (simple solution for demo)
task_status = {}

@api_view(['POST'])
@permission_classes([AllowAny])
def process_diagnostic(request):
    try:
        segment = request.data.get('customerSegment', '')
        problem = request.data.get('problem', '')
        proposition = request.data.get('valueProposition', '')
        # Authentication is optional for public analysis now
        user_id = None
        
        if request.user.is_authenticated:
            # Credit Check for Logged Users
            user_id = request.user.id
            profile = getattr(request.user, 'profile', None)
            if not profile:
                # Fallback/Recovery if signal failed
                from .models import UserProfile
                profile = UserProfile.objects.create(user=request.user)
                
            if profile.credits <= 0:
                return Response(
                    {"error": "Insufficient credits", "detail": "Você usou todos seus créditos gratuitos. Faça upgrade para continuar."}, 
                    status=402
                )
                
            # Deduct Credit
            profile.credits -= 1
            profile.save()
        else:
            # Anonymous User Strategy (Limit or Free)
            # For now, we allow it (Public Demo)
            pass

        # File Upload Handling
        pitch_deck_text = None
        if 'pitch_deck' in request.FILES:
            try:
                from .utils.pdf_parser import extract_text_from_pdf
                pdf_file = request.FILES['pitch_deck']
                # Limit file size check could be here (e.g. < 10MB)
                pitch_deck_text = extract_text_from_pdf(pdf_file)
                print(f"📄 PDF Processed. Extracted {len(pitch_deck_text)} chars.")
            except Exception as pdf_err:
                print(f"⚠️ Error processing PDF: {pdf_err}")

        # WORKAROUND PARA RENDER FREE TIER (timeout 100s)
        if getattr(settings, 'CELERY_TASK_ALWAYS_EAGER', False):
            import threading
            # Import preguiçoso para evitar erros de ciclo/init module level
            # Import from the new services package
            from .services import analyze_idea
            
            # 1. Cria o registro no banco 'Processing'
            diagnostic = Diagnostic.objects.create(
                user_id=user_id,
                customer_segment=segment,
                problem=problem,
                value_proposition=proposition,
                score=0,
                feedback="Processando... (Servidor Acordando)",
            )
            
            # 2. Define a função worker
            def run_analysis_thread(diag_id, seg, prob, prop, deck_text):
                try:
                    print(f"🧵 Thread iniciada para Diagnostic {diag_id}")
                    result = analyze_idea(seg, prob, prop, deck_text)
                    
                    d = Diagnostic.objects.get(pk=diag_id)
                    d.score = result.get('score', 0)
                    
                    # Ensure we save robustly
                    feedback_data = result.get('feedback', {})

                    # VC MVP Layers
                    d.company_name = result.get('company_name', 'Startup S/N')
                    d.recommendation = result.get('recommendation', 'N/A')
                    
                    # 1. Save to JSONField (Modern)
                    d.result = feedback_data
                    
                    # 2. Save to TextField as JSON String (Legacy/Backup)
                    if isinstance(feedback_data, dict):
                        d.feedback = json.dumps(feedback_data, ensure_ascii=False)
                    else:
                        d.feedback = str(feedback_data)
                        
                    d.save()
                    print(f"✅ Thread finalizada para Diagnostic {diag_id}")
                except Exception as e:
                    print(f"❌ Thread falhou: {e}")
                    import traceback
                    traceback.print_exc()
                    try:
                        d = Diagnostic.objects.get(pk=diag_id)
                        d.feedback = f"Erro interno na análise: {str(e)}"
                        d.save()
                    except:
                        pass

            # 3. Dispara a thread
            t = threading.Thread(target=run_analysis_thread, args=(diagnostic.id, segment, problem, proposition, pitch_deck_text))
            t.daemon = True 
            t.start()

            return Response({
                "task_id": f"db_task_{diagnostic.id}", 
                "status": "processing"
            })

        # MODO CELERY REAL (Com Redis)
        task = analyze_startup_task.delay(segment, problem, proposition, user_id, pitch_deck_text)
        return Response({
            "task_id": task.id, 
            "status": "processing"
        })

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(error_details)
        return Response({
            "error": str(e),
            "detail": "Erro interno no servidor (Views Check)",
            "trace": error_details 
        }, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def check_status(request, task_id):
    # Verifica se é polling de Banco de Dados (Workaround)
    if task_id.startswith("db_task_"):
        diag_id = task_id.replace("db_task_", "")
        try:
            diagnostic = Diagnostic.objects.get(pk=diag_id)
            
            # Convenção básica: se feedback começa com "Processando...", ainda não acabou
            if diagnostic.feedback.startswith("Processando..."):
                 return Response({"status": "processing"})
            
            return Response({
                "status": "completed", 
                "data": {
                    "id": diag_id,
                    "score": diagnostic.score,
                    "feedback": diagnostic.feedback,
                    "result": diagnostic.result,
                    "customer_segment": diagnostic.customer_segment,
                    "created_at": diagnostic.created_at.isoformat()
                }
            })
        except Diagnostic.DoesNotExist:
            return Response({"status": "failed", "error": "Diagnóstico não encontrado"})
            
    # Polling padrão do Celery (Redis)
    result = AsyncResult(task_id)
    if result.ready():
        return Response({
            "status": "completed", 
            "data": result.result 
        })
    else:
        return Response({"status": "processing"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history(request):
    try:
        print(f"DEBUG: History Request from User ID: {request.user.id} | Name: {request.user.username}")
        diagnostics = Diagnostic.objects.filter(user=request.user).order_by('-created_at')
        history_list = []
        for item in diagnostics:
            history_list.append({
                'id': item.id,
                'customer_segment': item.customer_segment,
                'problem': item.problem,
                'value_proposition': item.value_proposition,
                'score': item.score,
                'feedback': item.feedback,
                'created_at': item.created_at.strftime('%Y-%m-%d %H:%M')
            })
        return Response({
            'history': history_list,
            'debug_user': request.user.username,
            'debug_id': request.user.id
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_history(request, pk):
    try:
        diagnostic = Diagnostic.objects.get(pk=pk, user=request.user)
        diagnostic.delete()
        return Response({"message": "Análise excluída com sucesso."}, status=204)
    except Diagnostic.DoesNotExist:
        return Response({"error": "Análise não encontrada."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def rename_history(request, pk):
    try:
        new_title = request.data.get('new_title')
        if not new_title:
             return Response({"error": "Novo título não fornecido."}, status=400)
             
        diagnostic = Diagnostic.objects.get(pk=pk, user=request.user)
        # We store the Title in 'customer_segment' field for now, as that's what History uses.
        diagnostic.customer_segment = new_title
        diagnostic.save()
        
        return Response({"message": "Análise renomeada com sucesso."}, status=200)
    except Diagnostic.DoesNotExist:
        return Response({"error": "Análise não encontrada."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({"status": "ok", "service": "Daat AI Backend"})

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_startup(request):
    try:
        startup_data = request.data
        
        # Instancia dependências
        openai_client = OpenAIClient()
        tavily_client = TavilySearchClient()
        
        # Executa Fase 1
        service = Phase1MarketResearch(openai_client, tavily_client)
        result = service.execute(startup_data)
        
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

class DiagnosticViewSet(viewsets.ModelViewSet):
    serializer_class = DiagnosticSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Diagnostic.objects.filter(user=self.request.user).order_by('-created_at')

class WebhookViewSet(viewsets.ModelViewSet):
    serializer_class = WebhookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WebhookConfig.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_feedback(request):
    try:
        serializer = AnalysisFeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
