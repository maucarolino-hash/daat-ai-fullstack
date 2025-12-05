# ... imports existentes ...
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Diagnostic
from .tasks import analyze_startup_task
from celery.result import AsyncResult
from django.contrib.auth.models import User
# from django.http import JsonResponse (Removido)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({"status": "ok", "message": "Server is running"})

@api_view(['POST'])
@permission_classes([AllowAny])
def process_diagnostic(request):
    segment = request.data.get('customerSegment', '')
    problem = request.data.get('problem', '')
    proposition = request.data.get('valueProposition', '')
    user_id = request.user.id if request.user.is_authenticated else None

    # WORKAROUND PARA RENDER FREE TIER (timeout 100s)
    # Se Celery estiver em modo EAGER (Sem Redis), usamos Threading para não bloquear
    # o request HTTP e evitar erro 504 Gateway Timeout.
    if getattr(settings, 'CELERY_TASK_ALWAYS_EAGER', False):
        import threading
        from .services import analyze_idea
        
        # 1. Cria o registro no banco 'Processing'
        diagnostic = Diagnostic.objects.create(
            user_id=user_id,
            customer_segment=segment,
            problem=problem,
            value_proposition=proposition,
            score=0,
            feedback="Processando...",
            # Adicione status field se seu model tiver, senão usamos convention
        )
        
        # 2. Define a função worker
        def run_analysis_thread(diag_id, seg, prob, prop):
            try:
                print(f"🧵 Thread iniciada para Diagnostic {diag_id}")
                result = analyze_idea(seg, prob, prop)
                
                # Atualiza o registro
                d = Diagnostic.objects.get(pk=diag_id)
                d.score = result.get('score', 0)
                d.feedback = result.get('feedback', '')
                d.save()
                print(f"✅ Thread finalizada para Diagnostic {diag_id}")
            except Exception as e:
                print(f"❌ Thread falhou: {e}")
                d = Diagnostic.objects.get(pk=diag_id)
                d.feedback = f"Erro interno: {str(e)}"
                d.save()

        # 3. Dispara a thread
        t = threading.Thread(target=run_analysis_thread, args=(diagnostic.id, segment, problem, proposition))
        t.daemon = True # Morre se o processo principal morrer
        t.start()

        # 4. Retorna ID imediatamente para polling
        return Response({
            "task_id": f"db_task_{diagnostic.id}", # Prefixo para identificar que é DB polling
            "status": "processing"
        })

    # MODO CELERY REAL (Com Redis)
    try:
        task = analyze_startup_task.delay(segment, problem, proposition, user_id)
        return Response({
            "task_id": task.id, 
            "status": "processing"
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def check_status(request, task_id):
    # Verifica se é polling de Banco de Dados (Workaround)
    if task_id.startswith("db_task_"):
        diag_id = task_id.replace("db_task_", "")
        try:
            diagnostic = Diagnostic.objects.get(pk=diag_id)
            
            # Convenção básica: se feedback for "Processando...", ainda não acabou
            if diagnostic.feedback == "Processando...":
                 return Response({"status": "processing"})
            
            return Response({
                "status": "completed", 
                "data": {
                    "score": diagnostic.score,
                    "feedback": diagnostic.feedback
                }
            })
        except Diagnostic.DoesNotExist:
            return Response({"status": "failed", "error": "Diagnóstico não encontrado"})
            
    # Polling padrão do Celery
    result = AsyncResult(task_id)
    if result.ready():
        if result.failed():
             return Response({"status": "failed", "error": str(result.result)})
        return Response({
            "status": "completed", 
            "data": result.result
        })
    else:
        return Response({"status": "processing"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history(request):
    diagnostics = Diagnostic.objects.filter(user=request.user).order_by('-created_at')[:10]
    
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
        
    return Response({'history': history_list})

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
