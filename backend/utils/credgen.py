import hashlib
from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

# Simple in-memory store: student_id -> record. Replace with real DB/IPFS later.
credential_store = {}


def generate_certificate_pdf(metadata: dict) -> bytes:
    """Builds a basic PDF certificate from the credential data."""
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width / 2, height - 100, "Certificate of Completion")

    c.setFont("Helvetica", 12)
    lines = [
        f"Student ID: {metadata['student_id']}",
        f"Name: {metadata['name']}",
        f"Degree: {metadata['degree']}",
        f"Major: {metadata['major']}",
        f"GPA: {metadata['gpa']}",
        f"Issuing Institution: {metadata['issuing_institution']}",
    ]
    y = height - 160
    for line in lines:
        c.drawString(100, y, line)
        y -= 25

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer.getvalue()


def compute_pdf_hash(pdf_bytes: bytes) -> str:
    """SHA-256 hash of the raw PDF bytes."""
    return hashlib.sha256(pdf_bytes).hexdigest()


def issue_credential_pdf(metadata: dict) -> dict:
    """Generates the PDF, hashes it, and stores the record. Called from main.py."""
    pdf_bytes = generate_certificate_pdf(metadata)
    pdf_hash = compute_pdf_hash(pdf_bytes)

    record = {
        "metadata": metadata,
        "pdf_hash": pdf_hash,
        "pdf_bytes": pdf_bytes,
    }
    credential_store[metadata["student_id"]] = record

    return {"pdf_hash": pdf_hash, "student_id": metadata["student_id"]}
