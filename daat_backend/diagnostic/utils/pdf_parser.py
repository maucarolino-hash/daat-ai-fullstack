import logging
from pypdf import PdfReader
from io import BytesIO

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_obj, max_pages=10):
    """
    Extracts text from a PDF file object (in-memory).
    Limits to max_pages to avoid huge tokens.
    """
    try:
        reader = PdfReader(file_obj)
        text = ""
        count = 0
        for page in reader.pages:
            if count >= max_pages:
                break
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
            count += 1
        
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting PDF text: {e}")
        return ""
