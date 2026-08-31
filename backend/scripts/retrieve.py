# TODO: Fetch required event from blockchain
from ape import accounts, project
from deploy import main as deployed
from crypto import sign_hash, hash_canonical_json, canonicalize_json

account = accounts.test_accounts[0]  # relayer/owner — pays gas, submits tx

get_contract = deployed()  # deployed contract instance
contract_address = get_contract.address
contract = project.store.at(contract_address)


def build_certificate_payload(certificate_data: dict, ipfs_cid: str):
    """
    Canonicalizes + hashes certificate_data, signs it with the issuer key,
    and returns the tuple anchor_certificate expects.
    """
    canonical = canonicalize_json(certificate_data)
    target_hash = hash_canonical_json(canonical)
    issuer_signature = sign_hash(target_hash)
    return [target_hash, ipfs_cid, issuer_signature]


def load_hash(val):
    tx_receipt = contract.anchor_certificate(*val, sender=account)
    events = list(tx_receipt.decode_logs(project.Store.CertificateAnchored))
    if events:
        print(f"Success! The new issue is: {events[0].target_hash}")


def get_hash(CID):
    return contract.cid_to_hash(CID)


def get_certificate(CID):
    return contract.get_certificate_by_cid(CID)


# Example usage:
# certificate_data = {"student": "Jane Doe", "degree": "B.Tech CSE", "year": 2026}
# val = build_certificate_payload(certificate_data, ipfs_cid="Qm...")
# load_hash(val)
