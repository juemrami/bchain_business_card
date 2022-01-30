# This Project was Created with the Rust [Smart Contract Template](https://github.com/near-examples/rust-template)

Please start there if you wish to start with creating smart contracts on rust. It's a great template. It's what i used for this project as my baseline.  

## Getting started

If you would just like to play with the contract using Rust this is your place to start.
If you would like do deploy the contract to testnet and have it ready for the frontend  see [`/frontend/contract/`](../frontend/contract/README.md)

_MAKE SURE YOUR TERMINAL IS IN THE RIGHT DIRECTORY_.

0. __Exploring the contract:__

    This contract's code can be found inside of the [`lib.rs`](/src/lib.rs) file. In NEAR we usually compile our contracts as a library because it will be used by accounts as a library when managing the public methods and data stores for the contract as opposed to a binary file which is just like a one time exectuable.
    
    Once compiled with the correct flags (see __Building the contract__ below), you can browse the actual inside of the target folder `target/wasm32-unknown-unknown/release/<name>.wasm` if you are interested. _Note. This wasm is auto generated so it might not be very readable but its interesting regardless imo._

1. __Building the contract:__

    `RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release`

    This compiles a webassembly or `wasm` file which contains the logic of the contract found in `src/lib.rs`
    
    
    _I encourage you to check the lib.rs file and look at the methods under `#[cfg(test)]` to what these next tests that we will execute actually do._


2. __Testing the contract:__

   This will run all the test while display macros like `pintln!()` in the contract code with the `--nocapture` option.

    `cargo test -- --nocapture`

**Get more info at:**

* [NEAR Rust Smart Contract Quick Start](https://docs.near.org/docs/develop/contracts/rust/intro)
* [The Rust NEAR-SDK Book](https://www.near-sdk.io/) - *highly recommend*
* [Testing NEAR Rust Smart Contracts](https://docs.near.org/docs/develop/contracts/rust/testing-rust-contracts)
* [The Official Rust-Lang Book](https://doc.rust-lang.org/) - *essential*
