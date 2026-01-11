from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .services.deck_generator import DeckGenerator
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny]) # For demo purposes, allow any. Production usually IsAuthenticated.
def generate_pitch_deck(request):
    try:
        description = request.data.get('description', '')
        sector = request.data.get('sector', 'Technology')
        
        if not description:
            return Response({"error": "Description is required"}, status=400)
            
        generator = DeckGenerator()
        deck_structure = generator.generate_deck(description, sector)
        
        return Response(deck_structure)
        
    except Exception as e:
        logger.error(f"API Error generating deck: {e}")
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_improved_pitch_deck(request, pk):
    """
    Generates an improved pitch deck based on an existing Diagnostic analysis.
    """
    from .models import Diagnostic
    try:
        diagnostic = Diagnostic.objects.get(pk=pk)
        
        # Load internal data
        import json
        # Load internal data
        import json
        try:
            if isinstance(diagnostic.result, dict):
                result = diagnostic.result
            elif isinstance(diagnostic.result, str) and diagnostic.result.strip():
                try:
                    result = json.loads(diagnostic.result)
                except json.JSONDecodeError:
                     # Fallback to feedback field if result is malformed
                     result = json.loads(diagnostic.feedback) if diagnostic.feedback and diagnostic.feedback.startswith('{') else {}
            else:
                result = {}
        except Exception:
             result = {}
        
        # Extract context
        startup_info = {
            "name": diagnostic.company_name,
            "sector": result.get('sector_adjustment', {}).get('sector_detected', diagnostic.customer_segment),
            "stage": result.get('score_breakdown', {}).get('traction', {}).get('reason', 'Seed') # Proxy
        }
        current_score = diagnostic.score
        score_breakdown = result.get('score_breakdown', {})
        deck_summary = result.get('executive_summary', "No summary available.")
        
        generator = DeckGenerator()
        improved_deck = generator.generate_improved_deck(
            startup_info=startup_info,
            current_score=current_score,
            score_breakdown=score_breakdown,
            deck_summary=deck_summary,
            target_investor="VC Generalist" # Could be customizable
        )
        
        return Response(improved_deck)

    except Diagnostic.DoesNotExist:
        return Response({"error": "Analysis not found"}, status=404)
    except Exception as e:
        logger.error(f"API Error generating improved deck: {e}")
        return Response({"error": str(e)}, status=500)
