#!/bin/bash
set -e

RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
mkdir -p ../Frontend/contract_out
cp target/wasm32-unknown-unknown/release/*.wasm ../Frontend/contract_out/contract.wasm