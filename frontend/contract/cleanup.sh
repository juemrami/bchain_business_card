#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for required environment variables"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$BENEFICIARY" ] && echo "Missing \$BENEFICIARY environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"
[ -z "$BENEFICIARY" ] || echo "Found it! \$BENEFICIARY is set to [ $BENEFICIARY ]"

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Deleting $CONTRACT"
echo "Any contract balance will transfered to $BENEFICIARY"
echo ---------------------------------------------------------
echo

near delete $CONTRACT $BENEFICIARY

echo
echo ---------------------------------------------------------
echo "Step 2: Clean up project folders"
echo ---------------------------------------------------------
echo
rm -r ./neardev
rm ./wasm32_out/*.wasm

exit 0