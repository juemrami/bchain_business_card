#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 1: Build the contract (may take a few seconds)"
echo ---------------------------------------------------------
echo

./build-contract.sh

echo
echo
echo ---------------------------------------------------------
echo "Step 2: Deploy the contract"
echo ---------------------------------------------------------
echo

near dev-deploy wasm32_out/contract.wasm

echo
echo -----------------------------------------------------------------------------
echo "Step 3: Prepare your environment"
echo
echo "(1) Find YOUR contract (account) name in the message above"
echo "    it will look like: 'Done deploying to dev-1231231231231-12312312312312'"
echo
echo "(2) set an environment variable using this account name"
echo "    see example below (this may not work on Windows)"
echo
echo -----------------------------------------------------------------------------
echo "example:"
echo
echo 'export CONTRACT=dev-1231231231231-12312312312312'
echo -----------------------------------------------------------------------------
echo

exit 0
