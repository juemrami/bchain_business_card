# This Project was Created with the Rust [Smart Contract Template](https://github.com/near-examples/rust-template)

Please start there if you wish to start with creating smart contracts on rust. It's a great template. It's what i used for this project as my baseline.  

## Getting started

_MAKE SURE YOUR TERMINAL IS IN THE RIGHT DIRECTROY_.

If you would just like to play with the contract using Rust and the NEAR CLI this is your place to strart.
If you would like do deploy the contract and have it ready for the frontend  see [`/frontend/contract_out/`](../frontend/contract_out/README.md).

1. When you're ready:

    Build the contract

    `RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release`

    This compiles a webassembly or `wasm` library/binary build from the Rust smart contract.

    __I encourage you to check the lib.rs file and look at the `#[test]` to what the test that we will execute actually do.__

2. When you're ready:

   Test the contract

   This will run all the test while display macros like `pintln!()` in the contract code with the `--nocapture` option.

    `cargo test -- --nocapture`

**Get more info at:**

* [Rust Smart Contract Quick Start](https://docs.near.org/docs/develop/contracts/rust/intro)
* [Rust SDK Book](https://www.near-sdk.io/)
