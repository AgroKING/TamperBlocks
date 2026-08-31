# Using web3 for deploying smartcontracts!
from ape import accounts, project

from utils.crypto import issuer_account


def main():
    #account = accounts.load("meta_mask")  # TODO: use .env for safe loading
    account = accounts.test_accounts[0]
    contract = account.deploy(project.store,issuer_account.address)
    print(f"Store deployed at: {contract.address}")
    print(f"Issued set to : {issuer_account.address}")
    return contract

if __name__ == "__main__":
    main()
