from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Diagnostic
from .tasks import analyze_startup_task
from celery.result import AsyncResult

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_diagnostic(request):
    segment = request.data.get('customerSegment', '')
    problem = request.data.get('problem', '')
    proposition = request.data.get('valueProposition', '')
    
    # Dispara a tarefa para o "Espaço" (Redis)
    # Passamos o ID do usuário para salvar o histórico lá na tarefa (se implementado)
    # Por enquanto, a tarefa retorna o JSON, e o frontend vai buscar via polling.
    # Para manter o histórico funcionando, o ideal é salvar no final da tarefa.
    try:
        task = analyze_startup_task.delay(segment, problem, proposition, request.user.id)
        
        # Suporte para Modo Eager (Desenvolvimento sem Redis)
        # Se a tarefa já terminou (foi síncrona), retorna o resultado direto!
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
        print(traceback.format_exc()) # Imprime no terminal para debug
        return Response({
            "error": str(e),
            "detail": "Erro ao iniciar a tarefa de análise."
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_status(request, task_id):
    result = AsyncResult(task_id)

    if result.ready():
        # Se deu erro na tarefa
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
    # FILTRO MÁGICO: Só pega os diagnósticos DO USUÁRIO ATUAL
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
