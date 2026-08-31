import json
import hashlib
from typing import Dict, Any
from eth_account import Account
from eth_account.messages import encode_defunct

# Deterministic private key representing the University/Issuer
ISSUER_PRIVATE_KEY = "0x" + hashlib.sha256(b"University Issuer Seed").hexdigest()
issuer_account = Account.from_key(ISSUER_PRIVATE_KEY)

def canonicalize_json(data: Dict[str, Any]) -> str:
    """
    Deterministic serialization of a JSON dictionary (alphabetical keys, no spaces in separators).
    """
    return json.dumps(data, sort_keys=True, separators=(',', ':'))

def hash_canonical_json(canonical_str: str) -> bytes:
    """
    Computes the SHA-256 hash of a canonicalized JSON string.
    """
    return hashlib.sha256(canonical_str.encode('utf-8')).digest()

def sign_hash(target_hash: bytes, private_key: str = ISSUER_PRIVATE_KEY) -> bytes:
    """
    Signs a hash using ECDSA and the issuer's private key.
    """
    message = encode_defunct(primitive=target_hash)
    signed = Account.sign_message(message, private_key)
    return signed.signature

def verify_signature(target_hash: bytes, signature: bytes, expected_address: str) -> bool:
    """
    Recovers the address from an ECDSA signature and compares it to the expected address.
    """
    try:
        message = encode_defunct(primitive=target_hash)
        recovered_address = Account.recover_message(message, signature=signature)
        return recovered_address.lower() == expected_address.lower()
    except Exception:
        return False
