#!/bin/bash
set -e

# 1. Start a local Foundry chain in the background
anvil --host 127.0.0.1 --port 8545 &
ANVIL_PID=$!

# Give it a moment to come up
sleep 2

# 2. Deploy the contract fresh on this chain and capture its address
DEPLOY_OUTPUT=$(uv run ape run deploy --network ethereum:local:foundry)
echo "$DEPLOY_OUTPUT"

NEW_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "Store deployed at:" | awk '{print $NF}')

if [ -z "$NEW_ADDRESS" ]; then
  echo "ERROR: could not parse deployed contract address, aborting."
  kill $ANVIL_PID
  exit 1
fi

echo "Deployed contract at $NEW_ADDRESS — patching services.py"

# 3. Patch the hardcoded CONTRACT_ADDRESS so this boot's API calls match this boot's chain
sed -i "s/^CONTRACT_ADDRESS = .*/CONTRACT_ADDRESS = \"$NEW_ADDRESS\"/" utils/services.py

# 4. Start the API (Render provides $PORT)
uv run uvicorn main:app --host 0.0.0.0 --port "${PORT:-10000}"