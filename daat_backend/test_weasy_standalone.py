import sys
import os

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
import django
django.setup()

from django.template.loader import render_to_string
from weasyprint import HTML
import traceback

def test_render():
    context = {
        'segment': 'Test Segment',
        'score': 85,
        'classification': 'Alta Viabilidade',
        'analysis': {'sections': {'mercado': '<p>Test</p>', 'forcas': ['F1'], 'riscos': ['R1'], 'conselho': '<p>Advice</p>'}}
    }
    
    try:
        print("Rendering template...")
        html_string = render_to_string('diagnostic/report_pdf.html', context)
        print("Template rendered. Length:", len(html_string))
        
        print("Converting to PDF...")
        HTML(string=html_string).write_pdf("test_standalone.pdf")
        print("PDF Success!")
    except Exception:
        traceback.print_exc()

if __name__ == "__main__":
    test_render()
