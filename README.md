# TamperBlocks

TamperBlocks is a blockchain-backed system designed to assist academic
institutions in issuing digitally signed, tamper-proof credentials. By combining
cryptographic JSON canonicalization, ECDSA digital signatures, and an immutable
Vyper smart contract, the platform delivers rapid, transparent, and defensible
academic records with high-confidence verification.

In an era where digital trust is paramount, fake degrees and slow manual
verification create massive friction for employers, universities, and government
bodies. TamperBlocks addresses these challenges through decentralized ledger
anchoring, an intuitive visual blockchain explorer, immutable audit logging,
and instant QR-based public verification that eliminates the need to contact the
issuing institution directly.

Deployed link : https://tamperblocks.duckdns.org

## Table of contents

- Requirements
- Installation
- Configuration
- Usage
- Architecture
- Cryptographic methodology
- Smart contract & storage
- Security & compliance
- Troubleshooting
- Maintainers


## Requirements

This project requires the following tools and services:

- Node.js (v18.0.0 or higher) for the React frontend
- Python (v3.10.0 or higher) for the FastAPI backend
- [Ape Framework](https://apeworx.io/) (eth-ape v0.8.20+) for Vyper smart
  contract compilation and testing
- [Foundry](https://getfoundry.sh/) (Anvil) for the local Ethereum JSON-RPC test
  network
- [Vyper](https://docs.vyperlang.org/) compiler for smart contracts


## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/AgroKING/TamperBlocks.git
    cd TamperBlocks
    ```
1. Start the local Foundry blockchain network (runs on `127.0.0.1:8545`):
    ```bash
    anvil
    ```
1. Open a new terminal, navigate to the backend directory, and set up the
   Python environment:
    ```bash
    cd backend
    uv venv 
    source .venv/bin/activate
    uv sync
    ```
1. Deploy the smart contract using Ape (make note of the deployed address):
    ```bash
    ape run deploy --network ethereum:local:foundry
    ```
1. Start the FastAPI backend server (runs on `127.0.0.1:8000`):
    ```bash
    uv run main.py
    ```
1. Open a third terminal, navigate to the frontend directory, and install Node
   dependencies:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```


## Configuration

1. Go to `backend/utils/services.py` and ensure the `CONTRACT_ADDRESS` variable
   matches the address generated during the `ape run deploy` step.
1. The frontend uses a Vite proxy by default, so API requests to `/api` are
   automatically routed to `http://localhost:8000`. If you host the frontend
   separately, set `VITE_API_BASE` in your frontend environment variables to
   point to the live backend URL.
1. The Ape ecosystem is pre-configured in `backend/ape-config.yaml` to default
   to `ethereum:local:foundry`.


## Usage

Launch the multi-page React application via Vite (`npm run dev`).

The application provides four operational modules accessible from the homepage:

- **Issuer Portal**: Manual entry of student academic data. Produces an instant
  cryptographic hash, generates an IPFS CID, and anchors the credential to the
  blockchain. Generates a live QR code for instant sharing.
- **Verifier Portal**: Public-facing portal for employers. Enter a certificate
  hash (or scan a QR code) to instantly verify the cryptographic signature and
  on-chain status against the live ledger.
- **University Lookup**: Internal audit tool allowing lookup by standard Student ID
  or direct Certificate Hash. Automatically flags if a credential has been revoked.
- **Live Ledger**: Real-time visual blockchain explorer. Renders the smart
  contract details as the Genesis block and dynamically displays the chain of
  all issued credentials with their exact on-chain timestamps.


## Architecture

TamperBlocks employs a layered, decentralized software architecture:

```
+-------------------------------------------------------------------------+
|                           React Web Interface                           |
|  [Issuer Portal]    [Verifier Portal]   [Audit Lookup]    [Live Ledger] |
+--------------------+-------------------+---------------+----------------+
                     |                   |               |
                     v                   v               v
+-------------------------------------------------------------------------+
|                               FastAPI Core                              |
|  - JSON Canonicalization Engine       - Off-chain IPFS Mock Manager     |
|  - ECDSA Signature Generator          - Ape Framework RPC Bridge        |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        Blockchain & Storage Layer                       |
|    - Vyper Smart Contract (Anvil)       - ipfs_mock_db.json             |
+-------------------------------------------------------------------------+
```


### Technology stack

| Component | Technology | Rationale |
|---|---|---|
| Runtime | Node.js & Python 3.10+ | Standard Web3 & data ecosystem |
| Web UI | React + Vite | Rapid multi-page frontend with hot-reloading |
| API Layer | FastAPI | High-performance async Python backend |
| Blockchain | Ape Framework | Python-native Web3 development environment |
| Smart Contracts | Vyper | Secure, auditable Pythonic smart contracts |
| Local Node | Foundry (Anvil) | Ultra-fast local Ethereum testnet |
| Off-chain Storage | JSON (Mock IPFS) | Simulates decentralized metadata storage |


## Cryptographic methodology

### JSON canonicalization

To ensure that whitespace or key ordering does not alter the hash of the
metadata, the system strictly formats all incoming student data into a
canonicalized JSON string before hashing.

### Target hash generation

The canonicalized JSON is hashed using standard cryptographic algorithms
(SHA-256 / Keccak256). This `target_hash` becomes the immutable fingerprint
of the academic record. Any modification to the data—even a single decimal
point change in a GPA—will result in a completely different hash, instantly
breaking verification.

### Asymmetric verification

The backend holds an authorized issuer private key. Before anchoring a record
on-chain, the system signs the `target_hash`. The smart contract uses ECDSA
public key recovery to verify that the signature was generated by the authorized
issuer, completely preventing spoofed records.


## Smart contract & storage

- **On-chain**: The Vyper smart contract maintains a `HashMap[bytes32, CertificateRecord]`
  that permanently stores the `target_hash`, the timestamp of issuance, and a
  revocation flag. This guarantees immutability and precise temporal proof.
- **Off-chain**: The actual student metadata (Name, Degree, GPA) is stored in
  an off-chain IPFS mock database (`ipfs_mock_db.json`), mapped by CID. This
  prevents bloated gas costs and keeps the on-chain ledger highly efficient.


## Security & compliance

- **Data privacy**: By storing only cryptographic hashes on the public ledger,
  student PII (Personally Identifiable Information) remains completely private.
  The on-chain data cannot be reverse-engineered to reveal the student's identity.
- **Tamper-evident design**: Verification relies purely on mathematics. If the
  off-chain data is altered, its re-computed hash will not match the hash
  anchored on the blockchain, instantly flagging the record as fraudulent.
- **Revocation handling**: Authorized issuers can call the `revoke_certificate`
  function on the smart contract. The ledger history remains immutable, but the
  record is permanently flagged as void.


## Troubleshooting

- **ContractNotFoundError**: The backend is unable to locate the smart contract.
  Ensure that you ran `ape run deploy` and correctly copied the output address
  into `backend/utils/services.py`.
- **Ape script failed / Extra arguments**: If the Python subprocess throws a
  CLI parsing error, ensure you have pulled the latest backend changes where
  arguments are passed securely via the `SCRIPT_ARGS` environment variable.
- **Anvil connection refused**: Ensure the Foundry `anvil` node is running in a
  background terminal on port `8545`.


## Maintainers

- Aagaman Pokhrel - [AgroKING](https://github.com/AgroKING)
- Ishan kharel - [prosishan18](https://github.com/proishan18)
- Kritan Lamichhane -[kritanlamichhane](https://github.com/kritanlamichhane)
- Oasis Poudel- [OasisPoudel](https://github.com/OasisPoudel)
- Bibhusan Kc -[Zansux](https://github.com/ZansSux)
- Madhbi Sah -[madhbisah](https://github.com/madhbisah74)
