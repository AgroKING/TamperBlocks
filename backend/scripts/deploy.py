# Using web3 for deploying smartcontracts!
from ape import project,accounts

def main():
    #account = accounts.load("meta_mask")  # TODO: use .env for safe loading
    account = accounts.test_accounts[0]
    contract = account.deploy(project.store)
    print(f"Store deployed at: {contract.address}")
    return contract

if __name__ == "__main__":
    main()
