# Created with Rust Smart Contract Template

## Getting started

If you would just like to play with the contract using Rust this is your place to start.
If you would like do deploy the contract to testnet and have it ready for the frontend  see [`/frontend/contract/`](../frontend/contract/README.md)

_MAKE SURE YOUR TERMINAL IS IN THE RIGHT DIRECTORY_.

0. __Exploring the contract:__

    This contract's code can be found inside of the [`lib.rs`](/src/lib.rs) file. In NEAR we usually compile our contracts as a library because it will be used by accounts as a library when managing the public methods and data stores for the contract as opposed to a binary file which is just like a one time exectuable.
    
    Once compiled with the correct flags (see __Building the contract__ below), you can browse the actual inside of the target folder `target/wasm32-unknown-unknown/release/<name>.wasm` if you are interested. _Note. This wasm is auto generated so it might not be very readable but its interesting regardless imo._

1. __Building the contract:__

    `RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release`

Test the contract 

    `cargo test -- --nocapture`

2. __Testing the contract:__

   This will run all the test while display macros like `pintln!()` in the contract code with the `--nocapture` option.


**Get more info at:**

* [Rust Smart Contract Quick Start](https://docs.near.org/docs/develop/contracts/rust/intro)
* [Rust SDK Book](https://www.near-sdk.io/)
