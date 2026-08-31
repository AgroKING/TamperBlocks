from typing import Any

from fastapi import HTTPException

from utils.bridge import run_ape_script
from utils.crypto import (
    canonicalize_json,
    hash_canonical_json,
    sign_hash,
    verify_signature,
)
from utils.ipfs import fetch_from_ipfs, upload_to_ipfs

CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"


def issue_new_certificate(metadata_dict: dict[str, Any]) -> dict[str, Any]:
    """
    Business logic for issuing a new certificate and anchoring it on-chain.
    All chain interaction happens inside the Ape script this calls out to.
    """
    canonical_json = canonicalize_json(metadata_dict)
    target_hash = hash_canonical_json(canonical_json)
    target_hash_hex = "0x" + target_hash.hex()

    existing = run_ape_script(
        "retrieve", ["get_certificate", target_hash_hex, CONTRACT_ADDRESS]
    )
    if existing.get("exists"):
        raise HTTPException(
            status_code=400, detail="Certificate target hash already anchored on-chain"
        )

    student_id = metadata_dict.get("student_id", "")
    if student_id:
        from utils.ipfs import _load_ipfs_db

        db = _load_ipfs_db()
        for cid, metadata in db.items():
            if (
                metadata.get("student_id", "").strip().lower()
                == student_id.strip().lower()
            ):
                check_canonical = canonicalize_json(metadata)
                check_hash = hash_canonical_json(check_canonical)
                check_hash_hex = "0x" + check_hash.hex()

                check_existing = run_ape_script(
                    "retrieve", ["get_certificate", check_hash_hex, CONTRACT_ADDRESS]
                )
                if check_existing.get("exists") and not check_existing.get("revoked"):
                    raise HTTPException(
                        status_code=400,
                        detail=f"An active certificate already exists for Student ID '{student_id}'. Revoke it first before issuing a new one.",
                    )

    signature = sign_hash(target_hash)
    signature_hex = "0x" + signature.hex()

    ipfs_cid = upload_to_ipfs(metadata_dict)

    try:
        result = run_ape_script(
            "anchor", [target_hash_hex, ipfs_cid, signature_hex, CONTRACT_ADDRESS]
        )
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=f"Anchoring failed: {e}")

    if result.get("status") != "success":
        raise HTTPException(
            status_code=502,
            detail=f"Anchoring failed: {result.get('error', 'unknown error')}",
        )

    return {
        "status": "success",
        "message": "Certificate issued and anchored successfully",
        "target_hash": target_hash_hex,
        "ipfs_cid": ipfs_cid,
        "issuer_signature": signature_hex,
        "block_index": result.get("block_index"),
        "transaction_hash": result.get("tx_hash"),
    }


def verify_certificate_by_hash(target_hash_hex: str) -> dict[str, Any]:
    """
    Business logic to verify a certificate's integrity and authenticity.
    """
    if not target_hash_hex.startswith("0x"):
        target_hash_hex = "0x" + target_hash_hex

    try:
        bytes.fromhex(target_hash_hex[2:])
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid target hash format. Must be a valid hex string.",
        )

    record = run_ape_script(
        "retrieve", ["get_certificate", target_hash_hex, CONTRACT_ADDRESS]
    )

    if not record.get("exists"):
        return {"verified": False, "reason": "Target hash not anchored on the ledger"}

    ipfs_cid = record["ipfs_cid"]
    signature_bytes = bytes.fromhex(record["issuer_signature"].replace("0x", ""))
    block_index = record["block_index"]
    revoked = record["revoked"]
    timestamp = record["timestamp"]
    target_hash = bytes.fromhex(target_hash_hex[2:])

    ipfs_data = fetch_from_ipfs(ipfs_cid)

    re_canonical = canonicalize_json(ipfs_data)
    re_hash = hash_canonical_json(re_canonical)
    integrity_ok = re_hash == target_hash

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
            "not_revoked": active_ok,
        },
        "metadata": ipfs_data,
    }


def revoke_certificate_by_hash(
    target_hash_hex: str, reason: str = ""
) -> dict[str, Any]:
    """
    Business logic to revoke a certificate on-chain.
    """
    if not target_hash_hex.startswith("0x"):
        target_hash_hex = "0x" + target_hash_hex

    try:
        bytes.fromhex(target_hash_hex[2:])
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid target hash format. Must be a valid hex string.",
        )

    record = run_ape_script(
        "retrieve", ["get_certificate", target_hash_hex, CONTRACT_ADDRESS]
    )
    if not record.get("exists"):
        raise HTTPException(status_code=404, detail="Certificate not found on-chain")
    if record.get("revoked"):
        raise HTTPException(status_code=400, detail="Certificate is already revoked")

    try:
        result = run_ape_script("revoke", [target_hash_hex, CONTRACT_ADDRESS])
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=f"Revocation failed: {e}")

    if result.get("status") != "success":
        raise HTTPException(
            status_code=502,
            detail=f"Revocation failed: {result.get('error', 'unknown error')}",
        )

    return {
        "status": "success",
        "message": f"Certificate with hash {target_hash_hex} successfully revoked on-chain",
        "transaction_hash": result.get("tx_hash"),
        "reason": reason,
    }


def lookup_by_student_id(student_id: str) -> dict[str, Any]:
    """
    Looks up a certificate by student_id by searching the IPFS mock database.
    Returns the metadata and associated target_hash.
    """
    from utils.crypto import canonicalize_json, hash_canonical_json
    from utils.ipfs import _load_ipfs_db

    db = _load_ipfs_db()

    best_match = None

    for cid, metadata in db.items():
        if metadata.get("student_id", "").strip().lower() == student_id.strip().lower():
            # Recompute the target_hash from the metadata
            canonical = canonicalize_json(metadata)
            target_hash = hash_canonical_json(canonical)
            target_hash_hex = "0x" + target_hash.hex()

            match_data = {
                "found": True,
                "student_id": metadata["student_id"],
                "target_hash": target_hash_hex,
                "ipfs_cid": cid,
                "metadata": metadata,
            }

            # Check on-chain status
            check_existing = run_ape_script(
                "retrieve", ["get_certificate", target_hash_hex, CONTRACT_ADDRESS]
            )

            match_data["revoked"] = check_existing.get("revoked", False)
            match_data["timestamp"] = check_existing.get("timestamp", 0)

            if check_existing.get("exists") and not check_existing.get("revoked"):
                # Active certificate found! Return it immediately.
                return match_data
            elif check_existing.get("exists"):
                # Revoked certificate. Save it as fallback in case no active one exists.
                best_match = match_data
            elif not best_match:
                # Not on chain at all, just a fallback
                best_match = match_data

    if best_match:
        return best_match

    raise HTTPException(
        status_code=404, detail=f"No certificate found for student ID: {student_id}"
    )


def get_system_status() -> dict[str, Any]:
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
        "network": "local-foundry",
    }


def get_all_blocks() -> list[dict[str, Any]]:
    from utils.crypto import canonicalize_json, hash_canonical_json
    from utils.ipfs import _load_ipfs_db

    db = _load_ipfs_db()
    blocks = []

    for cid, metadata in db.items():
        canonical = canonicalize_json(metadata)
        target_hash = hash_canonical_json(canonical)
        target_hash_hex = "0x" + target_hash.hex()

        # Check on-chain status
        try:
            on_chain = run_ape_script(
                "retrieve", ["get_certificate", target_hash_hex, CONTRACT_ADDRESS]
            )
            if on_chain.get("exists"):
                blocks.append(
                    {
                        "hash": target_hash_hex,
                        "cid": cid,
                        "student_id": metadata.get("student_id"),
                        "name": metadata.get("name"),
                        "timestamp": on_chain.get("timestamp"),
                        "revoked": on_chain.get("revoked"),
                        "block_index": on_chain.get("block_index"),
                    }
                )
        except Exception:
            pass

    # Sort by block index
    blocks.sort(key=lambda x: x["block_index"])
    return blocks
