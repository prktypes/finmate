import fitz  # PyMuPDF
import os

def extract_text_from_pdf(filepath: str) -> str:
    """
    Extracts raw text from a PDF file using PyMuPDF.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
        
    extracted_text = ""
    try:
        # Open the PDF file
        with fitz.open(filepath) as pdf_document:
            for page_num in range(len(pdf_document)):
                page = pdf_document.load_page(page_num)
                # Extract text using 'text' layout
                extracted_text += page.get_text("text") + "\n"
                
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")
        
    return extracted_text.strip()
