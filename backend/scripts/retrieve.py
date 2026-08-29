# TODO : Fetch required event from blockchain
from ape import accounts, project

account = accounts.load("meta_mask")

contract_address = ""  # use from .env
contract = project.Store.at(contract_address)


def load_hash(val):
    tx_receipt = contract.anchor_certificate(*val, sender=account)

    # 3. Read the logged event
    events = list(tx_receipt.decode_logs(project.Store.CertificateAnchored))
    if events:
        print(f"Success! The new issue is: {events[0].target_hash}")


def get_hash(CID):
    return contract.cid_to_hash(CID)


def get_certificate(CID):
    return contract.get_certificate_by_cid(CID)


val = [target_hash, ipfs_cid, issuer_signature]  # the required values
