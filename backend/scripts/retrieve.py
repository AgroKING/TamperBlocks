import json
import os

from ape import accounts, project
import warnings
#warnings.filterwarnings("ignore")


def main():
    args = json.loads(os.environ["SCRIPT_ARGS"])
    command = args[0]
    contract_address = args[-1]

    account = accounts.test_accounts[0]
    contract = project.store.at(contract_address)

    if command == "get_certificate":
        target_hash_hex = args[1]
        target_hash = bytes.fromhex(target_hash_hex.replace("0x", ""))

        record = contract.certificates(target_hash)
        # CertificateRecord struct: (ipfs_cid, issuer_signature, block_index, revoked, timestamp, exists)
        result = {
            "ipfs_cid": record[0],
            "issuer_signature": "0x" + record[1].hex(),
            "block_index": record[2],
            "revoked": record[3],
            "timestamp": record[4],
            "exists": record[5],
        }
        print(json.dumps(result))

    elif command == "get_issuer":
        issuer = contract.issuer()
        print(json.dumps({"issuer": issuer}))

    elif command == "get_status":
        owner = contract.owner()
        issuer = contract.issuer()
        certificate_count = contract.certificate_count()
        print(json.dumps({
            "owner": owner,
            "issuer": issuer,
            "certificate_count": certificate_count,
        }))

    else:
        print(json.dumps({"error": f"Unknown command: {command}"}))
