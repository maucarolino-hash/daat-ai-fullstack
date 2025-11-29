from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .services import analyze_idea
from .models import Diagnostic

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_diagnostic(request):
    segment = request.data.get('customerSegment', '')
    problem = request.data.get('problem', '')
    proposition = request.data.get('valueProposition', '')
    
    result = analyze_idea(segment, problem, proposition)
    
    # Salvar no Banco de Dados vinculado ao usuário
    Diagnostic.objects.create(
        user=request.user,
        customer_segment=segment,
        problem=problem,
        value_proposition=proposition,
        score=result.get('score'),
        feedback=result.get('feedback')
    )
    
    return Response({
        'status': 'analisado',
        'score': result.get('score'),
        'feedback': result.get('feedback')
    })

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
