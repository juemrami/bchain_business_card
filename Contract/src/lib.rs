/* Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)

use std::collections::HashMap;

/* TODO:
 * ------------------------------
 * 0. Implement a better system for keeping track of supported blockchains.
 *    so that i can parse input validity for add_blockchain() better instead of that long match.
 *
 * 1. Setup create_card() so that you can pass optional agruments like website and 1 blockchain
 *    so that we dont have make as many calls in the futur
 *
 * 2. Keep track of vouches and refutes separately instead of having an overall rating score.
 *
 * 3. Make it so that only people who you have authorized (maybe someone youve done work for)
 *    can vouch/refute you blockchain experience.
 *
 * 4. Keep tracks of jobs youve gotten for each specific blockchain.
 */
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, setup_alloc, AccountId, PanicOnDefault};

setup_alloc!();
// fn ntoy(near_amount: u128) -> U128 {
//     U128(near_amount * 10u128.pow(24))
// }

//Json Struct for displaying to Future Frontend
#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonBusinessCard {
    owner_id: AccountId,
    website_url: Option<String>,
    experience: Vec<String>,
}

//A Business card contains Owner ID, Website URL, and Experience
//Experience is a set of blockchains youve developed on with rating (given by others)
#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, PanicOnDefault)]
#[serde(crate = "near_sdk::serde")]
pub struct BusinessCard {
    pub owner_id: AccountId,
    pub website_url: Option<String>,
    pub blockchain_exp: HashMap<String, i32>,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    pub owner_id: AccountId,
    pub records: LookupMap<AccountId, BusinessCard>,
}
fn ntoy(near_amount: u128) -> U128 {
    U128(near_amount * 10u128.pow(24))
}
#[near_bindgen]
impl Contract {
    #[init]
    
    pub fn new() -> Self {
        Self {
            owner_id: "juemrami.testnet".to_string(),
            records: LookupMap::new(b"r".to_vec()),
        }
    }
    pub fn set_website(&mut self, url: String) {
        let account_id = env::signer_account_id();
        assert!(url != "", "Url must be non empty.");
        let mut business_card = {
            match self.records.get(&account_id) {
                Some(card) => card,
                None => panic!("No business card exists for this account."),
            }
        };
        business_card.website_url = Some(url.clone());
        self.records.insert(&account_id, &business_card);
        env::log(format!("Url: {url} added for account: {account_id}").as_bytes());
        println!("Url: {url} added for account: {account_id}")
    }
    pub fn add_blockchain(&mut self, blockchain_name: String) {
        match blockchain_name.as_ref(){
            "NEAR" => (),
            "Ethereum" => (),
            "Cardano" => (),
            "Solana" => (),
            "Polkadot" => (),
            "Terra" => (),
            "Avalanche" => (),
            _=> panic!("Not a valid blockchain: only NEAR, Ethereum, Cardano, Solana, Polkadot, Terra, Avalanche."),
        }
        let account_id = env::signer_account_id();
        let mut business_card = {
            match self.records.get(&account_id) {
                Some(card) => card,
                None => panic!("No business card exists for this account."),
            }
        };
        let mut blockchain_exp = business_card.blockchain_exp;
        if blockchain_exp.contains_key(&blockchain_name) {
            panic!("This blockchain is already associated with this account.");
        } else {
            blockchain_exp.insert(blockchain_name.clone(), 0);
            env::log(
                format!("Experience: {blockchain_name} added for account: {account_id}").as_bytes(),
            );
        }
        business_card.blockchain_exp = blockchain_exp;
        self.records.insert(&account_id, &business_card);
        println!("Successfully added {} to {}", &blockchain_name, &account_id);
    }
    pub fn vouch(&mut self, card_owner_id: AccountId, blockchain_name: String) {
        let account_id = env::signer_account_id();
        match blockchain_name.as_ref(){
            "NEAR" => (),
            "Ethereum" => (),
            "Cardano" => (),
            "Solana" => (),
            "Polkadot" => (),
            "Terra" => (),
            "Avalanche" => (),
            _=> panic!("Not a valid blockchain: only NEAR, Ethereum, Cardano, Solana, Polkadot, Terra, Avalanche."),
        }
        let mut business_card = {
            match self.records.get(&card_owner_id) {
                Some(card) => card,
                None => panic!("No business card exists for this account."),
            }
        };
        let mut blockchain_exp = business_card.blockchain_exp;
        match &blockchain_exp.contains_key(&blockchain_name) {
            true => {
                let mut rating = blockchain_exp.get(&blockchain_name).unwrap().clone();
                rating += 1;
                blockchain_exp.insert(blockchain_name.clone(), rating.clone());
                env::log(format!("{card_owner_id} has recivied a vocuh for {blockchain_name} from {account_id}. New count: {rating}").as_bytes());
                println!("{card_owner_id} has recivied a vocuh for {blockchain_name} from {account_id}. New count: {rating}");
            }
            false => panic!("This account has not add this blockchain to their experience."),
        }
        business_card.blockchain_exp = blockchain_exp;
        self.records.insert(&card_owner_id, &business_card);
    }

    pub fn refute(&mut self, card_owner_id: AccountId, blockchain_name: String) {
        let account_id = env::signer_account_id();
        match blockchain_name.as_ref(){
            "NEAR" => (),
            "Ethereum" => (),
            "Cardano" => (),
            "Solana" => (),
            "Polkadot" => (),
            "Terra" => (),
            "Avalanche" => (),
            _=> panic!("Not a valid blockchain: only NEAR, Ethereum, Cardano, Solana, Polkadot, Terra, Avalanche."),
        }
        let mut business_card = {
            match self.records.get(&card_owner_id) {
                Some(card) => card,
                None => panic!("No business card exists for this account."),
            }
        };
        let mut blockchain_exp = business_card.blockchain_exp;
        match &blockchain_exp.contains_key(&blockchain_name) {
            true => {
                let mut rating = blockchain_exp.get(&blockchain_name).unwrap().clone();
                rating -= 1;
                blockchain_exp.insert(blockchain_name.clone(), rating.clone());
                env::log(format!("{card_owner_id} has recivied a refute for {blockchain_name} from {account_id}. New count: {rating}").as_bytes());
                println!("{card_owner_id} has recivied a refute for {blockchain_name} from {account_id}. New count: {rating}");
            }
            false => panic!("This account has not add this blockchain to their experience."),
        }
        business_card.blockchain_exp = blockchain_exp;
        self.records.insert(&card_owner_id, &business_card);
    }

    #[payable]
    pub fn create_new_card(&mut self) {
        let account_id = env::signer_account_id();
        assert_eq!(env::attached_deposit(), ntoy(5).into(), "Incorrect deposit amount. Cost to create a card is 5 NEAR");
        assert!(
            self.records.contains_key(&account_id.to_string()) == false,
            "Business card for this account already exists."
        );
        let _balance = env::attached_deposit();
        let business_card = BusinessCard {
            owner_id: account_id.clone(),
            website_url: None,
            blockchain_exp: HashMap::new(),
        };
        // Use env::log to record logs permanently to the blockchain!
        env::log(format!("New Business Card created for account:{}", &account_id).as_bytes());
        println!("New Business Card created for account: {account_id}");
        self.records.insert(&account_id, &business_card);
    }

    // `match` is similar to `switch` in other languages.
    // self.records.get(&account_id) is not yet defined.
    // Learn more: https://doc.rust-lang.org/book/ch06-02-match.html#matching-with-optiont
    pub fn get_card(&self, account_id: String) -> BusinessCard {
        match self.records.get(&account_id) {
            Some(card) => card,
            None => panic!("No business card exists for this account."),
        }
    }
    
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(test)]
mod tests {

    use std::convert::{TryFrom, TryInto};

    use super::*;
    use near_sdk::json_types::ValidAccountId;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, If None is given for signer_account_id default of bob_near is used.
    fn get_context(signer_account_id: Option<String>, is_view: bool) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(match signer_account_id {
                Some(arg) => arg.try_into().unwrap(),
                None => ValidAccountId::try_from("bob_near".to_string()).unwrap(),
            })
            .is_view(is_view)
            .attached_deposit(ntoy(5).into()).build()
    }

    #[test]
    #[should_panic(expected = r#"The contract is not initialized"#)]
    fn default_deploy() {
        let context = get_context(None, false);
        testing_env!(context);
        let _contract = Contract::default();
    }
    #[test]
    fn get_card_and_display() {
        let mut context = get_context(None, false);
        // let account_id = &context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        
        //1st Signer 
        
        contract.create_new_card();
        let input_url = "www.example.com".to_string();
        contract.set_website(input_url.clone());
        let input = "NEAR".to_string();
        contract.add_blockchain(input.clone());
        let input = "Ethereum".to_string();
        contract.add_blockchain(input.clone());

        //2nd Signer
        context = get_context(Some("wendydoescode_near".to_string()), false);
        testing_env!(context);
        contract.create_new_card();
        let input_url = "www.wendywu.com".to_string();
        contract.set_website(input_url.clone());
        let input = "Polkadot".to_string();
        contract.add_blockchain(input.clone());
        let input = "Avalanche".to_string();
        contract.add_blockchain(input.clone());
        let input = "NEAR".to_string();
        contract.add_blockchain(input.clone());

        //3 create vouches/refutes
        context = get_context(Some("jack_near".to_string()), false);
        testing_env!(context);
        contract.vouch("bob_near".to_string(), "NEAR".to_string());
        contract.refute("bob_near".to_string(), "Ethereum".to_string());
        contract.vouch("wendydoescode_near".to_string(), "NEAR".to_string());
        contract.vouch("wendydoescode_near".to_string(), "Polkadot".to_string());
        contract.vouch("wendydoescode_near".to_string(), "Avalanche".to_string());

        //Displays
        let business_card = contract.get_card("bob_near".into());
        println!(
            "----------------------------------------\nBlockchainBusinessCard\n----------------------------------------\nAccount Name: \t {}\nWebsite: \t {}",
            &business_card.owner_id,
            &business_card.website_url.unwrap()
        );
        println!("---------Blockchain Experience----------");
        for (key, value) in &business_card.blockchain_exp {
            println!("{},\t Net vouches: {}", key, value);
        }
        let business_card = contract.get_card("wendydoescode_near".into());
        println!(
            "----------------------------------------\nBlockchainBusinessCard\n----------------------------------------\nAccount Name: \t {}\nWebsite: \t {}",
            &business_card.owner_id,
            &business_card.website_url.unwrap()
        );
        println!("---------Blockchain Experience----------");
        for (key, value) in &business_card.blockchain_exp {
            println!("{},\t Net vouches: {}", key, value);
        }


    }
    #[test]
    fn populate_card() {
        let mut context = get_context(None, false);
        let _account_id = &context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let input_url = "www.example.com".to_string();
        contract.set_website(input_url.clone());
        let input = "NEAR".to_string();
        contract.add_blockchain(input.clone());
        let input = "Ethereum".to_string();
        contract.add_blockchain(input.clone());

        context = get_context(Some("jack_near".to_string()), false);
        testing_env!(context);
        contract.vouch("bob_near".to_string(), "NEAR".to_string());
    }
    #[test]
    fn create_card() {
        let context = get_context(None, false);
        let account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let business_card = {
            match contract.records.get(&account_id) {
                Some(res) => res,
                None => panic!("No Record Found"),
            }
        };
        assert_eq!(account_id.to_string(), business_card.owner_id.to_string());
    }

    #[test]
    fn set_and_get_url() {
        let context = get_context(None, false);
        let account_id = context.signer_account_id.clone();
        testing_env!(context);

        let mut contract = Contract::new();
        contract.create_new_card();
        let input_url = "www.example.com".to_string();
        contract.set_website(input_url.clone());

        let business_card = {
            match contract.records.get(&account_id) {
                Some(res) => res,
                None => panic!("No Record Found"),
            }
        };
        let output_url = {
            match business_card.website_url {
                Some(res) => res,
                None => panic!("No URL Found"),
            }
        };
        assert_eq!(
            output_url, input_url,
            "URL mismatch {output_url} != {input_url}"
        );
    }
    #[test]
    fn get_and_set_experience() {
        let context = get_context(None, false);
        let account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let input = "NEAR".to_string();
        contract.add_blockchain(input.clone());

        let business_card = {
            match contract.records.get(&account_id) {
                Some(res) => res,
                None => panic!("No Record Found"),
            }
        };
        let rating = business_card.blockchain_exp.get(&input).unwrap();
        assert_eq!(rating.to_owned(), 0, "Test Fail, Ratings not equal");
    }
    #[test]
    #[should_panic(
        expected = r#"Not a valid blockchain: only NEAR, Ethereum, Cardano, Solana, Polkadot, Terra, Avalanche."#
    )]
    fn set_nonexistent_experience() {
        let context = get_context(None, false);
        let _account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let input = "TEST123".to_string();
        contract.add_blockchain(input.clone());
    }
    #[test]
    #[should_panic(expected = r#"No business card exists for this account."#)]
    fn experience_entry_no_card() {
        let context = get_context(None, false);
        let _account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        let input = "NEAR".to_string();
        contract.add_blockchain(input.clone());
    }
    #[test]
    #[should_panic(expected = r#"This blockchain is already associated with this account."#)]
    fn double_entry_experience() {
        let context = get_context(None, false);
        let _account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let input = "NEAR".to_string();
        contract.add_blockchain(input.clone());
        contract.add_blockchain(input.clone());
    }
    #[test]
    #[should_panic(expected = r#"Business card for this account already exists."#)]
    fn create_duplicate_card() {
        let context = get_context(None, false);
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        contract.create_new_card();
    }
    #[test]
    #[should_panic(expected = r#"No business card exists for this account."#)]
    fn access_non_existent_card() {
        let context = get_context(None, true);
        let account_id = context.signer_account_id.clone();
        testing_env!(context);
        let contract = Contract::new();
        contract.get_card(account_id);
    }
}
