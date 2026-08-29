from typing import Dict, Any
from fastapi import HTTPException
from utils.crypto import (
    canonicalize_json,
    hash_canonical_json,
    sign_hash,
    verify_signature,
    issuer_account,
    ISSUER_PRIVATE_KEY
)
from utils.ipfs import upload_to_ipfs, fetch_from_ipfs
from utils.blockchain import blockchain_manager, w3

def issue_new_certificate(metadata_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Business logic for issuing a new certificate and anchoring it on-chain.
    """
    # 1 & 2. Canonicalize and hash metadata
    canonical_json = canonicalize_json(metadata_dict)
    target_hash = hash_canonical_json(canonical_json)
    target_hash_hex = "0x" + target_hash.hex()
    
    # Check if already anchored
    existing = blockchain_manager.contract.functions.certificates(target_hash).call()
    if existing[5]:  # exists field is the 6th element
        raise HTTPException(status_code=400, detail="Certificate target hash already anchored on-chain")
        
    # 3. Sign the hash
    signature = sign_hash(target_hash)
    signature_hex = "0x" + signature.hex()
    
    # 4. Upload to mock IPFS
    ipfs_cid = upload_to_ipfs(metadata_dict)
    
    # 5. Anchor on-chain
    tx = blockchain_manager.contract.functions.anchor_certificate(
        target_hash,
        ipfs_cid,
        signature
    ).build_transaction({
        'from': issuer_account.address,
        'nonce': w3.eth.get_transaction_count(issuer_account.address),
        'gas': 500000,
        'gasPrice': w3.eth.gas_price
    })
    
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=ISSUER_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    # Retrieve block index from receipt or chain
    record = blockchain_manager.contract.functions.certificates(target_hash).call()
    block_index = record[2]
    
    return {
        "status": "success",
        "message": "Certificate issued and anchored successfully",
        "target_hash": target_hash_hex,
        "ipfs_cid": ipfs_cid,
        "issuer_signature": signature_hex,
        "block_index": block_index,
        "transaction_hash": tx_receipt.transactionHash.hex()
    }

def verify_certificate_by_hash(target_hash_hex: str) -> Dict[str, Any]:
    """
    Business logic to verify a certificate's integrity and authenticity.
    """
    try:
        # Convert hex string hash to bytes
        if target_hash_hex.startswith("0x"):
            target_hash_hex = target_hash_hex[2:]
        target_hash = bytes.fromhex(target_hash_hex)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid target hash format. Must be a valid hex string.")
        
    # Query smart contract
    record = blockchain_manager.contract.functions.certificates(target_hash).call()
    ipfs_cid, signature_bytes, block_index, revoked, timestamp, exists = record
    
    if not exists:
        return {
            "verified": False,
            "reason": "Target hash not anchored on the ledger"
        }
        
    # Fetch metadata from mock IPFS
    ipfs_data = fetch_from_ipfs(ipfs_cid)
    
    # Re-hash and check integrity
    re_canonical = canonicalize_json(ipfs_data)
    re_hash = hash_canonical_json(re_canonical)
    integrity_ok = (re_hash == target_hash)
    
    # Verify signature
    owner_address = blockchain_manager.contract.functions.owner().call()
    signature_ok = verify_signature(target_hash, signature_bytes, owner_address)
    
    # Check revocation status
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
    try:
        # Convert hex string hash to bytes
        if target_hash_hex.startswith("0x"):
            target_hash_hex = target_hash_hex[2:]
        target_hash = bytes.fromhex(target_hash_hex)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid target hash format. Must be a valid hex string.")
        
    # Check if exists
    record = blockchain_manager.contract.functions.certificates(target_hash).call()
    if not record[5]:
        raise HTTPException(status_code=404, detail="Certificate not found on-chain")
    if record[3]:
        raise HTTPException(status_code=400, detail="Certificate is already revoked")
        
    # Revoke on-chain
    tx = blockchain_manager.contract.functions.revoke_certificate(
        target_hash
    ).build_transaction({
        'from': issuer_account.address,
        'nonce': w3.eth.get_transaction_count(issuer_account.address),
        'gas': 500000,
        'gasPrice': w3.eth.gas_price
    })
    
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=ISSUER_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    return {
        "status": "success",
        "message": f"Certificate with hash {target_hash_hex} successfully revoked on-chain",
        "transaction_hash": tx_receipt.transactionHash.hex()
    }

def get_system_status() -> Dict[str, Any]:
    """
    Business logic to fetch system metrics and metadata.
    """
    owner_address = blockchain_manager.contract.functions.owner().call()
    count = blockchain_manager.contract.functions.certificate_count().call()
    return {
        "status": "active",
        "contract_address": blockchain_manager.contract_address,
        "issuer_address": owner_address,
        "total_certificates_anchored": count,
        "network": "local-eth-tester"
    }
