from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Diagnostic
from .services.investment_memo_service import InvestmentMemoService
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_investment_memo(request, pk):
    """
    Generates an Investment Memo for a specific Diagnostic (Analysis).
    """
    try:
        diagnostic = Diagnostic.objects.get(pk=pk)
        
        # Reconstruct necessary context from stored fields
        # Note: In a real scenario, we might want to store these explicitly or re-parse 'result' JSON
        # For now, we'll try to use the 'result' field if it's a JSON dict, or construct from fields.
        
        # Try to parse the stored result blob
        # Try to parse the stored result blob
        full_result = {}
        try:
            if isinstance(diagnostic.result, dict):
                full_result = diagnostic.result
            elif isinstance(diagnostic.result, str) and diagnostic.result.strip():
                full_result = json.loads(diagnostic.result)
        except:
            # Fallback
            full_result = {}


        startup_data = {
            "name": diagnostic.company_name or "Unknown Startup",
            "sector": diagnostic.customer_segment, # Using segment as sector proxy
            "stage": full_result.get('stage', 'Seed'),
            "score": diagnostic.score
        }

        # Extract structured analysis parts if available in the big JSON
        analysis_summary = {
            "strengths": full_result.get("strengths_synthesis", {}),
            "weaknesses": full_result.get("weaknesses_synthesis", {}),
            "market": full_result.get("market_sizing_analysis", {}),
            "risks": full_result.get("risk_analysis", {}) # If exists
        }

        scores_data = {
            "total_score": diagnostic.score,
            "recommendation": diagnostic.recommendation,
            # If we had breakdown stored, use it. Mocking for MVP if missing.
            "breakdown": full_result.get("score_breakdown", {})
        }

        service = InvestmentMemoService()
        memo_text = service.generate_memo(startup_data, analysis_summary, scores_data)

        return Response({
            "memo_markdown": memo_text,
            "company_name": diagnostic.company_name
        })

    except Diagnostic.DoesNotExist:
        return Response({"error": "Analysis not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
