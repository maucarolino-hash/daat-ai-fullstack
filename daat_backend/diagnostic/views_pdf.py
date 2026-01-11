from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import Diagnostic
import json
import logging

try:
    from weasyprint import HTML
except ImportError:
    HTML = None

from django.utils import timezone


logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([AllowAny]) # Change to IsAuthenticated in production if needed
def generate_pdf_report(request, report_id):
    if not HTML:
        return HttpResponse("WeasyPrint not installed", status=501)

    try:
        # Check if it's a DB Task ID pattern or raw ID
        clean_id = report_id.replace("db_task_", "")
        
        diagnostic = Diagnostic.objects.get(pk=clean_id)
        
        # Parse result logic
        # 1. Try 'result' JSONField (Ideal)
        # 2. Try 'feedback' parsed as JSON (Fallback/Current State)
        
        data = {}
        if diagnostic.result:
            data = diagnostic.result
        else:
            try:
                # If feedback is stringified JSON
                raw_feedback = diagnostic.feedback
                if isinstance(raw_feedback, str) and raw_feedback.strip().startswith('{'):
                    data = json.loads(raw_feedback)
                else:
                    # Legacy Text fallback
                    data = {
                        "sections": {
                            "mercado": raw_feedback,
                            "forcas": [],
                            "riscos": [],
                            "conselho": "Relatório em formato legado."
                        },
                        "metrics": {}
                    }
            except json.JSONDecodeError:
                data = {"sections": {"mercado": diagnostic.feedback}}

        import markdown # Import here or top level
        
        # Helper to convert MD
        def md_to_html(text):
            if isinstance(text, str):
                return markdown.markdown(text)
            return text

        # Prepare context for template
        # 1. Check if we have the NEW structure (marketData, riskAssessment, etc.)
        if 'marketData' in data or 'riskAssessment' in data:
            # Map NEW structure to Template Context
            metrics = {
                'marketSize': data.get('marketData', {}).get('tam', 'N/A'),
                'growthRate': data.get('marketData', {}).get('growthRate', 'N/A'),
                'competitorCount': len(data.get('competitors', []))
            }
            
            # Format Sections from Objects
            sections = {}
            
            # Mercado (Trends)
            trends = data.get('marketData', {}).get('trends', [])
            sections['mercado'] = "<ul>" + "".join([f"<li>{t}</li>" for t in trends]) + "</ul>"
            
            # Forças (Strengths)
            strengths = data.get('riskAssessment', {}).get('strengths', [])
            sections['forcas'] = [s.get('title', s) for s in strengths] # Template expects list of strings
            
            # Riscos (Risks)
            risks = data.get('riskAssessment', {}).get('risks', [])
            sections['riscos'] = [r.get('title', r) for r in risks]
            
            # Conselho (Roadmap)
            roadmap = data.get('strategicAdvice', {}).get('roadmap', [])
            # Format roadmap as nice HTML bullets
            roadmap_html = "<ul>"
            for item in roadmap:
                month = item.get('month', '?')
                title = item.get('title', '')
                roadmap_html += f"<li><strong>Mês {month}:</strong> {title}</li>"
            roadmap_html += "</ul>"
            sections['conselho'] = roadmap_html
            
        else:
            # Fallback to OLD structure
            metrics = data.get('metrics', {})
            raw_sections = data.get('sections', {})
            sections = {
                k: md_to_html(v) for k, v in raw_sections.items()
            }
        
        # Helper to format percentages
        def fmt_pct(val):
            return f"{val}%" if val else "N/A"

        context = {
            'segment': diagnostic.customer_segment,
            'score': diagnostic.score,
            'classification': "Alta Viabilidade" if diagnostic.score > 70 else "Viabilidade Moderada" if diagnostic.score > 40 else "Alto Risco",
            'date': timezone.localtime(diagnostic.created_at),
            'market_tam': metrics.get('marketSize', 'Não disponível'),
            'market_growth': fmt_pct(metrics.get('growthRate', 0)) if isinstance(metrics.get('growthRate'), (int, float)) else metrics.get('growthRate', 'N/A'),
            'competitors_count': metrics.get('competitorCount', 0),
            'analysis': {
                'sections': sections
            }
        }

        # Render HTML
        html_string = render_to_string('diagnostic/report_pdf.html', context)
        
        # Convert to PDF
        pdf_file = HTML(string=html_string).write_pdf()
        
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="relatorio_daat_{clean_id}.pdf"'
        return response

    except Diagnostic.DoesNotExist:
        return HttpResponse("Relatório não encontrado", status=404)
    except Exception as e:
        logger.error(f"PDF Generation Error: {e}")
        import traceback
        traceback.print_exc()
        return HttpResponse(f"Erro ao gerar PDF: {str(e)}", status=500)
