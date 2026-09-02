from typing import Any

from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
from utils.credgen import credential_store, issue_credential_pdf
from utils.services import (
    issue_new_certificate,
    lookup_by_student_id,
    revoke_certificate_by_hash,
    verify_certificate_by_hash,
)

app = FastAPI(
    title="TamperBlocks API",
    description="Credential Hashing, IPFS Storage, and Smart Contract Anchoring API",
    version="1.0.0",
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RevokeRequest(BaseModel):
    reason: str = ""


class StudentMetadata(BaseModel):
    student_id: str
    name: str
    degree: str
    major: str
    gpa: float
    issuing_institution: str


@app.post("/issue", response_model=dict[str, Any])
def issue_certificate(metadata: StudentMetadata):
    try:
        return issue_new_certificate(metadata.model_dump())
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to issue certificate: {e!s}"
        )


@app.get("/verify/{target_hash_hex}", response_model=dict[str, Any])
def verify_certificate(target_hash_hex: str):
    try:
        return verify_certificate_by_hash(target_hash_hex)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {e!s}")


@app.post("/revoke/{target_hash_hex}", response_model=dict[str, Any])
def revoke_certificate(target_hash_hex: str, body: RevokeRequest = RevokeRequest()):
    try:
        return revoke_certificate_by_hash(target_hash_hex, reason=body.reason)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Revocation failed: {e!s}")


@app.get("/lookup/{student_id}", response_model=dict[str, Any])
def lookup_credential(student_id: str):
    try:
        return lookup_by_student_id(student_id)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lookup failed: {e!s}")


@app.get("/status", response_model=dict[str, Any])
def get_system_status_endpoint():
    try:
        from utils.services import get_system_status

        return get_system_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {e!s}")


@app.get("/blocks", response_model=list[dict[str, Any]])
def get_blocks_endpoint():
    try:
        from utils.services import get_all_blocks

        return get_all_blocks()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch blocks: {e!s}")


@app.post("/generate-pdf", response_model=dict[str, Any])
def generate_pdf(metadata: StudentMetadata):
    return issue_credential_pdf(metadata.model_dump())

@app.post("/generate-pdf/download")
def generate_pdf_download(metadata: StudentMetadata):
    """
    Same as /generate-pdf, but returns the actual PDF bytes so a single
    button click can generate AND download the file in one request.
    """
    result = issue_credential_pdf(metadata.model_dump())
    pdf_bytes = credential_store[metadata.student_id]["pdf_bytes"]

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{metadata.student_id}_certificate.pdf"',
            "X-PDF-Hash": result["pdf_hash"],
        },
    )

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
