#!/bin/bash
set -e

RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
mkdir -p ../frontend/contract/
mkdir -p ../frontend/contract/wasm32_out/
cp target/wasm32-unknown-unknown/release/*.wasm ../frontend/contract/wasm32_out/contract.wasm