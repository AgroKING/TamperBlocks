# Guidelines for backend peps

- git pull origin main
- uv add {yourpackagename}
- ruff format {yourfile}
- ruff check {yourfile}
- git add {yourfiel}
- git commit -m "What you did"
### download github cli for ease of use 
-gh pr create --title "Your PR Title" --body "Your PR Description"

> [!NOTE]
> Test shit on your pc before commiting !!

>[!tip]
> Create a directory for fastapi , don't initialize with all that template junk!! . Headless initialization required

---

## Technical Implementation & Verification Summary

We have designed, implemented, and verified the **Academic Credential Verification System (TamperBlocks Backend)**. The system is split into modular layers ensuring high testability, clean division of concerns, and ease of maintainability.

### 1. Smart Contract Development
*   [`contracts/store.vy`](file:///d:/TamperBlocks/backend/contracts/store.vy): A Vyper 0.4.3 ledger contract storing target hashes, IPFS CIDs, signatures, and revocation states. Built constructor rules mapping contract ownership and protected state changes.

### 2. Core Utilities Architecture
*   [`utils/crypto.py`](file:///d:/TamperBlocks/backend/utils/crypto.py): Implements deterministic canonical JSON serialization, SHA-256 target hashing, and ECDSA signature creation/signer recovery.
*   [`utils/ipfs.py`](file:///d:/TamperBlocks/backend/utils/ipfs.py): Simulates a local IPFS storage registry that generates compliant Base58 multi-hash CIDs (`Qm...`).
*   [`utils/blockchain.py`](file:///d:/TamperBlocks/backend/utils/blockchain.py): Configures Web3 providers (`EthereumTesterProvider`), funds the university issuer account, compiles contract sources via `ape compile`, and manages automatic contract deployments.

### 3. Controller-Service Decoupling
*   [`utils/services.py`](file:///d:/TamperBlocks/backend/utils/services.py): A business services layer that abstracts transactional and computational processes (hashing, signing, Web3 builder calls, receipt confirmations) away from API routing.
*   [`main.py`](file:///d:/TamperBlocks/backend/main.py): A lightweight FastAPI router defining request/response models and routing incoming traffic to service logic. Employs modern FastAPI `lifespan` event context for smart contract deployment.

### 4. Integration Test Suite
*   [`tests/test_1.py`](file:///d:/TamperBlocks/backend/tests/test_1.py): A comprehensive suite of integration tests verifying:
    *   System initialization and contract metadata querying.
    *   End-to-end issuance, IPFS upload, and on-chain anchoring.
    *   Double-anchoring rejection (hash collision prevention).
    *   Integrity verification & signature recovery.
    *   Data tampering detection (simulated via mock storage alterations).
    *   On-chain revocation check logic.

### 5. Running the Backend & Tests
*   **Run Integration Tests**:
    ```powershell
    .venv\Scripts\python -m pytest -p no:eth-ape -s tests/test_1.py
    ```
*   **Run Developer Server (Swagger UI)**:
    ```powershell
    .venv\Scripts\python -m uvicorn main:app --reload
    ```
    API endpoints can then be manually checked/tested at: **`http://127.0.0.1:8000/docs`**
