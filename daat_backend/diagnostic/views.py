from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .services import analyze_idea

from .models import Diagnostic

@csrf_exempt
def process_diagnostic(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            segment = data.get('customerSegment', '')
            problem = data.get('problem', '')
            proposition = data.get('valueProposition', '')
            
            result = analyze_idea(segment, problem, proposition)
            
            # Salvar no Banco de Dados
            Diagnostic.objects.create(
                customer_segment=segment,
                problem=problem,
                value_proposition=proposition,
                score=result.get('score'),
                feedback=result.get('feedback')
            )
            
            return JsonResponse({
                'status': 'analisado',
                'score': result.get('score'),
                'feedback': result.get('feedback')
            })
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def get_history(request):
    if request.method == 'GET':
        # Buscar os últimos 10 diagnósticos
        diagnostics = Diagnostic.objects.all().order_by('-created_at')[:10]
        
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
            
        return JsonResponse({'history': history_list}, safe=False)
        
    return JsonResponse({'error': 'Method not allowed'}, status=405)
