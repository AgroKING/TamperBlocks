from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from utils.credgen import issue_credential_pdf
from utils.services import (
    issue_new_certificate,
    verify_certificate_by_hash,
    revoke_certificate_by_hash,
    get_system_status
)

app = FastAPI(
    title="TamperBlocks API",
    description="Credential Hashing, IPFS Storage, and Smart Contract Anchoring API",
    version="1.0.0",
)

class StudentMetadata(BaseModel):
    student_id: str
    name: str
    degree: str
    major: str
    gpa: float
    issuing_institution: str

@app.post("/issue", response_model=Dict[str, Any])
def issue_certificate(metadata: StudentMetadata):
    try:
        return issue_new_certificate(metadata.model_dump())
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to issue certificate: {str(e)}")

@app.get("/verify/{target_hash_hex}", response_model=Dict[str, Any])
def verify_certificate(target_hash_hex: str):
    try:
        return verify_certificate_by_hash(target_hash_hex)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@app.post("/revoke/{target_hash_hex}", response_model=Dict[str, Any])
def revoke_certificate(target_hash_hex: str):
    try:
        return revoke_certificate_by_hash(target_hash_hex)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Revocation failed: {str(e)}")

@app.get("/status", response_model=Dict[str, Any])
def get_system_status_endpoint():
    try:
        return get_system_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

@app.post("/generate-pdf", response_model=Dict[str, Any])
def generate_pdf(metadata: StudentMetadata):
    return issue_credential_pdf(metadata.model_dump())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
