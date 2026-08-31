import pytest
from fastapi.testclient import TestClient
from main import app
from utils.ipfs import _load_ipfs_db, _save_ipfs_db


@pytest.fixture(scope="module")
def client():
    # Context manager triggers the FastAPI startup event
    with TestClient(app) as c:
        yield c


def test_system_status(client):
    response = client.get("/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"
    assert data["contract_address"] is not None
    assert data["issuer_address"] is not None
    assert data["total_certificates_anchored"] == 0


def test_issue_and_verify_lifecycle(client):
    student_data = {
        "student_id": "STU12345",
        "name": "Kritan Lamichhane",
        "degree": "Bachelor of Science",
        "major": "Computer Science",
        "gpa": 3.95,
        "issuing_institution": "AgroKING University",
    }

    # 1. Issue the certificate
    issue_response = client.post("/issue", json=student_data)
    assert issue_response.status_code == 200
    issue_data = issue_response.json()
    assert issue_data["status"] == "success"

    target_hash = issue_data["target_hash"]
    ipfs_cid = issue_data["ipfs_cid"]
    signature = issue_data["issuer_signature"]

    assert target_hash.startswith("0x")
    assert ipfs_cid.startswith("Qm")
    assert signature.startswith("0x")

    # Verify count increased
    status_response = client.get("/status")
    assert status_response.json()["total_certificates_anchored"] == 1

    # 2. Try to issue same certificate again (should fail)
    reissue_response = client.post("/issue", json=student_data)
    assert reissue_response.status_code == 400
    assert "already anchored" in reissue_response.json()["detail"]

    # 3. Verify the certificate
    verify_response = client.get(f"/verify/{target_hash}")
    assert verify_response.status_code == 200
    verify_data = verify_response.json()
    assert verify_data["verified"] is True
    assert verify_data["verification_details"]["integrity_check_passed"] is True
    assert verify_data["verification_details"]["signature_check_passed"] is True
    assert verify_data["verification_details"]["not_revoked"] is True
    assert verify_data["metadata"]["name"] == "Kritan Lamichhane"

    # 4. Simulate IPFS Tampering
    # Load raw database, change GPA to 4.0, save it, and test verification
    db = _load_ipfs_db()
    original_metadata = db[ipfs_cid].copy()
    db[ipfs_cid]["gpa"] = 4.0
    _save_ipfs_db(db)

    tamper_verify_response = client.get(f"/verify/{target_hash}")
    assert tamper_verify_response.status_code == 200
    tamper_data = tamper_verify_response.json()
    assert tamper_data["verified"] is False
    assert tamper_data["verification_details"]["integrity_check_passed"] is False
    assert "computed hash mismatch" in tamper_data["reasons"][0]

    # Restore IPFS db content
    db[ipfs_cid] = original_metadata
    _save_ipfs_db(db)

    # 5. Revoke the certificate
    revoke_response = client.post(f"/revoke/{target_hash}")
    assert revoke_response.status_code == 200
    assert revoke_response.json()["status"] == "success"

    # 6. Verify again after revocation (should fail)
    post_revoke_verify_response = client.get(f"/verify/{target_hash}")
    assert post_revoke_verify_response.status_code == 200
    post_revoke_data = post_revoke_verify_response.json()
    assert post_revoke_data["verified"] is False
    assert post_revoke_data["verification_details"]["not_revoked"] is False
    assert "revoked" in post_revoke_data["reasons"][0]

    # 7. Try to revoke again (should fail)
    rerevoke_response = client.post(f"/revoke/{target_hash}")
    assert rerevoke_response.status_code == 400
    assert "already revoked" in rerevoke_response.json()["detail"]
