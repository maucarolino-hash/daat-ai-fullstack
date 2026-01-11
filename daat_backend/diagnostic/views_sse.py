from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.permissions import AllowAny
from rest_framework.renderers import BaseRenderer
from .models import Diagnostic
import json
import time

class ServerSentEventRenderer(BaseRenderer):
    media_type = 'text/event-stream'
    format = 'txt'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data

@api_view(['GET'])
@renderer_classes([ServerSentEventRenderer])
@permission_classes([AllowAny])
def stream_analysis(request, task_id):
    """
    Server-Sent Events (SSE) endpoint to stream analysis status.
    """
    clean_id = task_id.replace("db_task_", "")

    def event_stream():
        # Initial heartbeat
        yield f"data: {json.dumps({'status': 'connected'})}\n\n"
        
        last_feedback = ""
        timeout = 600 # 10 minutes max connection
        start_time = time.time()

        while True:
            if time.time() - start_time > timeout:
                yield f"data: {json.dumps({'status': 'error', 'message': 'Timeout'})}\n\n"
                break

            try:
                diagnostic = Diagnostic.objects.get(pk=clean_id)
                
                # Check for changes in feedback to send "logs"
                # Simplification: In a real scenario, we'd have a separate Log model or Redis list
                # Here we just check if feedback changed or if it's done.
                
                payload = {
                    "status": "processing",
                    "score": diagnostic.score,
                    "feedback": diagnostic.feedback
                }

                # Check completion conventions
                if not diagnostic.feedback.startswith("Processando..."):
                    payload["status"] = "completed"
                    payload["data"] = {
                        "id": clean_id,
                        "score": diagnostic.score,
                        "feedback": diagnostic.feedback,
                        "result": diagnostic.result
                    }
                    yield f"data: {json.dumps(payload)}\n\n"
                    break # End stream on completion
                
                # Send update if needed (heartbeat or change)
                # For demo purposes, we send periodically to keep connection alive
                yield f"data: {json.dumps(payload)}\n\n"
                
                time.sleep(2) # Check every 2s (server-side loop)

            except Diagnostic.DoesNotExist:
                yield f"data: {json.dumps({'status': 'error', 'message': 'Not found'})}\n\n"
                break
            except Exception as e:
                yield f"data: {json.dumps({'status': 'error', 'message': str(e)})}\n\n"
                break

    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no' # Disable buffering in Nginx
    return response
