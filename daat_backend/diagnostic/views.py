from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Diagnostic
from .tasks import analyze_startup_task
from celery.result import AsyncResult
from django.contrib.auth.models import User
from django.http import JsonResponse

# --- VIEW TEMPORÁRIA PARA CRIAR ADMIN EM PRODUÇÃO ---
def create_admin_user(request):
    # SEGURANÇA: Só permite criar se tiver a chave secreta na URL
    # Ex: /api/create-admin/?key=minha-senha-secreta-123
    if request.GET.get('key') != 'minha-senha-secreta-123':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        return JsonResponse({'status': 'Superuser created: admin / admin123'})
    else:
        return JsonResponse({'status': 'Superuser already exists'})
# ----------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_diagnostic(request):
    segment = request.data.get('customerSegment', '')
    problem = request.data.get('problem', '')
    proposition = request.data.get('valueProposition', '')
    
    try:
        task = analyze_startup_task.delay(segment, problem, proposition, request.user.id)
        
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
@permission_classes([IsAuthenticated])
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
