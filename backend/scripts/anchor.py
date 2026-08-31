import json
import os

from ape import accounts, project


def main():
    args = json.loads(os.environ["SCRIPT_ARGS"])
    target_hash_hex, ipfs_cid, signature_hex, contract_address = args[:4]

    account = accounts.test_accounts[0]
    contract = project.store.at(contract_address)

    target_hash = bytes.fromhex(target_hash_hex.replace("0x", ""))
    signature = bytes.fromhex(signature_hex.replace("0x", ""))

    tx_receipt = contract.anchor_certificate(target_hash, ipfs_cid, signature, sender=account)
    events = list(tx_receipt.decode_logs(contract.CertificateAnchored))

    result = {
        "status": "success",
        "tx_hash": tx_receipt.txn_hash,
        "block_index": events[0].block_index if events else None,
    }
    print(json.dumps(result))
