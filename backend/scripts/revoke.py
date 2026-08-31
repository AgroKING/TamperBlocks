import json
import os

from ape import accounts, project


def main():
    args = json.loads(os.environ["SCRIPT_ARGS"])
    target_hash_hex, contract_address = args[:2]

    account = accounts.test_accounts[0]
    contract = project.store.at(contract_address)

    target_hash = bytes.fromhex(target_hash_hex.replace("0x", ""))

    tx = contract.revoke_certificate(target_hash, sender=account)

    print(
        json.dumps(
            {
                "status": "success",
                "tx_hash": str(tx.txn_hash),
            }
        )
    )
