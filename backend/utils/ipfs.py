import os
import json
import hashlib
import base58
from typing import Dict, Any
from fastapi import HTTPException
from utils.crypto import canonicalize_json

# Persistent simulated IPFS database file
IPFS_DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ipfs_mock_db.json")

def _load_ipfs_db() -> Dict[str, Dict[str, Any]]:
    if not os.path.exists(IPFS_DB_FILE):
        return {}
    try:
        with open(IPFS_DB_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}

def _save_ipfs_db(db: Dict[str, Dict[str, Any]]):
    with open(IPFS_DB_FILE, "w") as f:
        json.dump(db, f, indent=4)

def upload_to_ipfs(data: Dict[str, Any]) -> str:
    """
    Simulates uploading metadata to IPFS.
    Computes standard Base58-encoded SHA-256 IPFS CIDv0 (Qm...).
    """
    canonical_str = canonicalize_json(data)
    h = hashlib.sha256(canonical_str.encode('utf-8')).digest()
    # IPFS CIDv0 prefix: 0x12 (SHA-256) and 0x20 (32 bytes size)
    multihash = b'\x12\x20' + h
    cid = base58.b58encode(multihash).decode('utf-8')
    
    db = _load_ipfs_db()
    db[cid] = data
    _save_ipfs_db(db)
    return cid

def fetch_from_ipfs(cid: str) -> Dict[str, Any]:
    """
    Simulates fetching metadata from IPFS by CID.
    """
    db = _load_ipfs_db()
    if cid not in db:
        raise HTTPException(status_code=404, detail=f"IPFS content with CID {cid} not found")
    return db[cid]
