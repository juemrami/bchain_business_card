#!/bin/bash
set -e

RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
mkdir -p ../next_frontend/contract/wasm32_out
cp target/wasm32-unknown-unknown/release/*.wasm ../next_frontend/contract/wasm32_out/contract.wasm