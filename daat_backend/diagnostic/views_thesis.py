from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .services.thesis_service import ThesisService

@api_view(['POST'])
@permission_classes([AllowAny]) # For MVP demo ease
def configure_thesis(request):
    """
    Endpoint to generate scoring weights from a text thesis.
    Payload: { "thesis": "We love early stage AI..." }
    """
    thesis_text = request.data.get('thesis')
    if not thesis_text:
        return Response({"error": "Thesis description is required"}, status=400)

    service = ThesisService()
    result = service.generate_custom_weights(thesis_text)
    
    return Response(result)
