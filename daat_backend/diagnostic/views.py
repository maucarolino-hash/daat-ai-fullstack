# ... imports existentes ...
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Diagnostic
from .tasks import analyze_startup_task
from celery.result import AsyncResult
from django.contrib.auth.models import User
# from django.http import JsonResponse (Removido)

@api_view(['POST'])
@permission_classes([AllowAny]) # Permite acesso sem login
def process_diagnostic(request):
    segment = request.data.get('customerSegment', '')
    problem = request.data.get('problem', '')
    proposition = request.data.get('valueProposition', '')
    
    # Se não tiver usuário logado, usa None (ou um ID fixo se necessário)
    user_id = request.user.id if request.user.is_authenticated else None

    try:
        task = analyze_startup_task.delay(segment, problem, proposition, user_id)
        
        if task.ready():
            return Response({
                "task_id": task.id,
                "status": "completed",
                "data": task.result
            })

        return Response({
            "task_id": task.id, 
            "status": "processing"
        })
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return Response({
            "error": str(e),
            "detail": "Erro ao iniciar a tarefa de análise."
        }, status=500)

@api_view(['GET'])
@permission_classes([AllowAny]) # Permite checar status sem login
def check_status(request, task_id):
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
