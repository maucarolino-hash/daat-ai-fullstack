import os
import sys
from io import BytesIO
from pypdf import PdfWriter, PdfReader
from diagnostic.utils.pdf_parser import extract_text_from_pdf

def create_dummy_pdf():
    """Creates a simple PDF in memory with known text."""
    buffer = BytesIO()
    writer = PdfWriter()
    page = writer.add_blank_page(width=72, height=72)
    # Note: pypdf writing text is complex without a font, 
    # but we can try to use annotations or just rely on a pre-existing file if this fails.
    # Actually, pypdf is bad at *creating* text content from scratch without existing pages.
    # Better approach for a test without reportlab: use a minimal raw PDF string.
    
    # Minimal PDF with text "Hello World" is complex to write raw.
    # Let's try to just write a simple annotation or metadata to see if parser catches it?
    # No, parser reads content stream.
    
    # Alternative: check if reportlab IS installed (we saw it failed).
    # We will try to download a tiny dummy PDF or use a hardcoded base64 string of a valid PDF.
    pass

# Minimal valid PDF with "Hello World"
# Source: generated via base64 for reliability
import base64
DUMMY_PDF_B64 = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCisgICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9FMSAxMiBUZgo1MCAxNzUgVGQKKHGVsbG8gRCBjb21wbGV0ZSBQUk9KRUNUIERhYXQgYWkhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTU3IDAwMDAwIG4gCjAwMDAwMDAyNTUgMDAwMDAgbiAKMDAwMDAwMDM0NCAwMDAwMCBuIAp0cmFpbGVyCjw8CiAgL1NpemUgNgogIC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0MzkKJSVFT0YK"
# Note: The above b64 might be malformed or simple. Let's use a very standard Hello World one.
# Re-encoding a simple "Hello" pdf.

def test_extraction():
    print("--- Testing PDF Extraction ---")
    
    # Decode sample PDF
    pdf_data = base64.b64decode("""
JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURl
Y29kZT4+CnN0cmVhbQp4nOMy0DMwMFQwqlQw5DII5TI2M7Y0MTS35DII5TIAAnwFfQplbmRzdHJl
YW0KZW5kb2JqCjMgMCBvYmoKNDIKZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDYgMCBSL0ZpbHRl
ci9GbGF0ZURlY29kZS9MIDEyPj4Kc3RyZWFtCnicMk00NTAwMFAwqlQw5DII5TIEAgB6gAOACmVu
ZHN0cmVhbQplbmRvYmoKNiAwIG9iagozMAplbmRvYmoKNCAwIG9iago8PC9UeXBlL1BhZ2UvUGFy
ZW50IDEgMCBSL01lZGlhQm94WzAgMCA1OTUuMjggODQxLjg5XS9Db250ZW50c1syIDAgUiA1IDAg
Ul0vUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGXS9Gb250PDwvRjE3IDcgMCBSPj4+Pj4+CmVuZG9i
ago3IDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYS9F
bmNvZGluZy9XaW5BbnNpRW5jb2Rpbmc+PgplbmRvYmoKMSAwIG9iago8PC9UeXBlL1BhZ2VzL0Ki
b3hbMCAwIDU5NS4yOCA4NDEuODldL0NvdW50IDEvS2lkc1s0IDAgUl0+PgplbmRvYmoKOCAwIG9i
ago8PC9DcmVhdG9yKEl0ZXh0IGJ5IGxvd2FnaWUgNC4yLjEpL1Byb2R1Y2VyKGlUZXh0wqkgNS41
LjExIMKpMjAwMC0yMDE3IGlUZXh0IEdyb3VwIE5WIFwoQUdQTC12ZXJzaW9uXCkpL01vZERhdGUo
RDoyMDI1MDEwODE3MDAwMC0wMycwMCcpL0NyZWF0aW9uRGF0ZShEOjIwMjUwMTA4MTcwMDAwLTAz
JzAwJyk+PgplbmRvYmoKeHJlZgowIDkKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwNDA1IDAw
MDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA4MyAwMDAwMCBuIAowMDAwMDAwMjQ5
IDAwMDAwIG4gCjAwMDAwMDAwOTkgMDAwMDAgbiAKMDAwMDAwMDE3NSAwMDAwMCBuIAowMDAwMDAw
MzE4IDAwMDAwIG4gCjAwMDAwMDA0OTYgMDAwMDAgbiAKdHJhaWxlcgo8PC9Sb290IDEgMCBSL1Np
emUgOS9JbmZvIDggMCBSPj4Kc3RhcnR4cmVmCjYzOQolJUVPRgo=
    """.strip())
    
    # That B64 is a bit specific, let's just make a file that contains "Hello World" using pypdf if we can, 
    # OR assume we can write a plain text PDF structure.
    
    # Actually, let's try to just use the one we have? No, we don't have one.
    # Let's write a simple file.
    
    with open("dummy_test.pdf", "wb") as f:
        f.write(pdf_data)
        
    print(f"Created dummy_test.pdf ({len(pdf_data)} bytes)")
    
    # Test Extraction
    try:
        with open("dummy_test.pdf", "rb") as f:
            text = extract_text_from_pdf(f)
            
        print("\n--- Extracted Text ---")
        print(text)
        print("----------------------")
        
        if len(text) > 0:
            print("SUCCESS: Text extracted.")
        else:
            print("FAILURE: No text extracted.")
            
    except Exception as e:
        print(f"EXCEPTION: {e}")
    finally:
        # Cleanup
        if os.path.exists("dummy_test.pdf"):
            os.remove("dummy_test.pdf")

if __name__ == "__main__":
    # Setup Django (just in case)
    import django
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    sys.path.append(BASE_DIR)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
    django.setup()
    
    test_extraction()
