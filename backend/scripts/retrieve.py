# TODO : Fetch required event from blockchain
#
#
from ape import accounts, project

# Getter for targetHash
def get_hash(CID):
    record = contract.get_certificate_by_cid("CID")
    return record.target_hash if hasattr(record, "target_hash") else record


account = accounts.load("meta_mask")

contract_address = ""  # use from .env
contract = project.Store.at(contract_address)

val = []  # the required values
tx_receipt = contract.anchor_certificate(*val, sender=account)

# 3. Read the logged event
events = list(tx_receipt.decode_logs(project.Store.CertificateAnchored))
if events:
    print(f"Success! The new issue is: {events[0].target_hash}")
