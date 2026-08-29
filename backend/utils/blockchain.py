import os
import json
from web3 import Web3
from web3.providers.eth_tester import EthereumTesterProvider
from utils.crypto import ISSUER_PRIVATE_KEY, issuer_account

# Initialize Web3 and Local Provider
w3 = Web3(EthereumTesterProvider())

# Fund the issuer account with 50 ETH from the default pre-funded eth-tester accounts
w3.eth.send_transaction({
    'from': w3.eth.accounts[0],
    'to': issuer_account.address,
    'value': w3.to_wei(50, 'ether')
})

class BlockchainManager:
    def __init__(self):
        self.contract_address = None
        self.contract_abi = None
        self.contract = None

    def deploy_contract(self):
        """
        Loads the compiled Store contract artifacts and deploys it using the local Web3 provider.
        """
        build_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".build", "__local__.json")
        if not os.path.exists(build_path):
            raise RuntimeError(f"Contract artifact not found at {build_path}. Run 'ape compile' first.")
            
        with open(build_path, "r") as f:
            artifact = json.load(f)
            
        if "contractTypes" not in artifact or "store" not in artifact["contractTypes"]:
            raise RuntimeError("Store contract type not found in compile artifacts.")
            
        store_artifact = artifact["contractTypes"]["store"]
        self.contract_abi = store_artifact["abi"]
        bytecode = store_artifact["deploymentBytecode"]["bytecode"]
        
        # Deploy Store contract
        store_contract = w3.eth.contract(abi=self.contract_abi, bytecode=bytecode)
        
        tx = store_contract.constructor().build_transaction({
            'from': issuer_account.address,
            'nonce': w3.eth.get_transaction_count(issuer_account.address),
            'gas': 3000000,
            'gasPrice': w3.eth.gas_price
        })
        
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=ISSUER_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        self.contract_address = tx_receipt.contractAddress
        self.contract = w3.eth.contract(address=self.contract_address, abi=self.contract_abi)
        print(f"[*] Smart contract deployed successfully at: {self.contract_address}")
        print(f"[*] Issuer/Owner address: {issuer_account.address}")

# Global singleton blockchain manager instance
blockchain_manager = BlockchainManager()
