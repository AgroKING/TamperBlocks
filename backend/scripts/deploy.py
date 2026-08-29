# Using web3 for deploying smartcontracts!
from ape import project,accounts

def main():
    account = accounts.load("meta_mask")  # TODO: use .env for safe loading
    contract = account.deploy(project.Store)
    print(f"Store deployed at: {contract.address}")
    return contract
