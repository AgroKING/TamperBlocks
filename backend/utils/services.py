import os
from typing import Dict, Any
from fastapi import HTTPException
from utils.crypto import (
    canonicalize_json,
    hash_canonical_json,
    sign_hash,
    verify_signature,
    issuer_account,
)
from utils.ipfs import upload_to_ipfs, fetch_from_ipfs
from utils.bridge import run_ape_script

CONTRACT_ADDRESS = os.environ.get("CONTRACT_ADDRESS", "0xYourDeployedAddressHere")


def issue_new_certificate(metadata_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Business logic for issuing a new certificate and anchoring it on-chain.
    All chain interaction happens inside the Ape script this calls out to.
    """
    canonical_json = canonicalize_json(metadata_dict)
    target_hash = hash_canonical_json(canonical_json)
    target_hash_hex = "0x" + target_hash.hex()

    existing = run_ape_script("retrieve", ["get_certificate", target_hash_hex, CONTRACT_ADDRESS])
    if existing.get("exists"):
        raise HTTPException(status_code=400, detail="Certificate target hash already anchored on-chain")

    signature = sign_hash(target_hash)
    signature_hex = "0x" + signature.hex()

    ipfs_cid = upload_to_ipfs(metadata_dict)

    try:
        result = run_ape_script("anchor", [target_hash_hex, ipfs_cid, signature_hex, CONTRACT_ADDRESS])
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=f"Anchoring failed: {e}")

    if result.get("status") != "success":
        raise HTTPException(status_code=502, detail=f"Anchoring failed: {result.get('error', 'unknown error')}")

    return {
        "status": "success",
        "message": "Certificate issued and anchored successfully",
        "target_hash": target_hash_hex,
        "ipfs_cid": ipfs_cid,
        "issuer_signature": signature_hex,
        "block_index": result.get("block_index"),
        "transaction_hash": result.get("tx_hash"),
    }


def verify_certificate_by_hash(target_hash_hex: str) -> Dict[str, Any]:
    """
    Business logic to verify a certificate's integrity and authenticity.
    """
    if not target_hash_hex.startswith("0x"):
        target_hash_hex = "0x" + target_hash_hex

    try:
        bytes.fromhex(target_hash_hex[2:])
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid target hash format. Must be a valid hex string.")

    record = run_ape_script("retrieve", ["get_certificate", target_hash_hex, CONTRACT_ADDRESS])

    if not record.get("exists"):
        return {
            "verified": False,
            "reason": "Target hash not anchored on the ledger"
        }

    ipfs_cid = record["ipfs_cid"]
    signature_bytes = bytes.fromhex(record["issuer_signature"].replace("0x", ""))
    block_index = record["block_index"]
    revoked = record["revoked"]
    timestamp = record["timestamp"]
    target_hash = bytes.fromhex(target_hash_hex[2:])

    ipfs_data = fetch_from_ipfs(ipfs_cid)

    re_canonical = canonicalize_json(ipfs_data)
    re_hash = hash_canonical_json(re_canonical)
    integrity_ok = (re_hash == target_hash)

    issuer_info = run_ape_script("retrieve", ["get_issuer", CONTRACT_ADDRESS])
    issuer_address = issuer_info["issuer"]
    signature_ok = verify_signature(target_hash, signature_bytes, issuer_address)

    active_ok = not revoked
    verified = integrity_ok and signature_ok and active_ok

    reasons = []
    if not integrity_ok:
        reasons.append("Data integrity verification failed (computed hash mismatch)")
    if not signature_ok:
        reasons.append("Issuer signature verification failed")
    if not active_ok:
        reasons.append("Certificate has been revoked")

    return {
        "verified": verified,
        "reasons": reasons if not verified else ["Verification successful"],
        "verification_details": {
            "ledger_anchored": True,
            "block_index": block_index,
            "timestamp": timestamp,
            "ipfs_cid": ipfs_cid,
            "integrity_check_passed": integrity_ok,
            "signature_check_passed": signature_ok,
            "not_revoked": active_ok
        },
        "metadata": ipfs_data
    }


def revoke_certificate_by_hash(target_hash_hex: str) -> Dict[str, Any]:
    """
    Business logic to revoke a certificate on-chain.
    """
    if not target_hash_hex.startswith("0x"):
        target_hash_hex = "0x" + target_hash_hex

    try:
        bytes.fromhex(target_hash_hex[2:])
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid target hash format. Must be a valid hex string.")

    record = run_ape_script("retrieve", ["get_certificate", target_hash_hex, CONTRACT_ADDRESS])
    if not record.get("exists"):
        raise HTTPException(status_code=404, detail="Certificate not found on-chain")
    if record.get("revoked"):
        raise HTTPException(status_code=400, detail="Certificate is already revoked")

    try:
        result = run_ape_script("revoke", [target_hash_hex, CONTRACT_ADDRESS])
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=f"Revocation failed: {e}")

    if result.get("status") != "success":
        raise HTTPException(status_code=502, detail=f"Revocation failed: {result.get('error', 'unknown error')}")

    return {
        "status": "success",
        "message": f"Certificate with hash {target_hash_hex} successfully revoked on-chain",
        "transaction_hash": result.get("tx_hash")
    }


def get_system_status() -> Dict[str, Any]:
    """
    Business logic to fetch system metrics and metadata.
    """
    status = run_ape_script("retrieve", ["get_status", CONTRACT_ADDRESS])
    return {
        "status": "active",
        "contract_address": CONTRACT_ADDRESS,
        "owner_address": status["owner"],
        "issuer_address": status["issuer"],
        "total_certificates_anchored": status["certificate_count"],
        "network": "local-eth-tester"
    }
