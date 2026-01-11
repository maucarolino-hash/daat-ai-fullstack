import sys
try:
    import weasyprint
    print(f"WeasyPrint Version: {weasyprint.__version__}")
    from weasyprint import HTML
except ImportError as e:
    print(f"Import Error: {e}")
    sys.exit(1)

def test_weasyprint():
    html_string = "<h1>Hello World</h1><p>Test PDF generation.</p>"
    try:
        print("Attempting to generate PDF...")
        pdf = HTML(string=html_string).write_pdf()
        print(f"PDF generated successfully. Size: {len(pdf)} bytes")
        
        with open("test_output.pdf", "wb") as f:
            f.write(pdf)
        print("Saved test_output.pdf")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_weasyprint()
