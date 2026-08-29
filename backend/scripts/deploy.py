# Using web3 for deploying smartcontracts!
from ape import project,accounts
account = accounts.load("<ALIAS>") ## TODO : use .env for safe loading
contract = project.get_contract("store")
