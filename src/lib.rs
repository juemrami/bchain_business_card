/* Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)

/* TODO:
 * ------------------------------
 * 0. Implement a better system for keeping track of supported blockchains.
 *    so that i can parse input validity for add_blockchain() better instead of that long match.
 * 
 * 1. Setup create_card() so that you can pass optional agruments like website and 1 blockchain
 *    so that we dont have make as many calls in the futur
 * 
 * 2. Keep track of vouches and refutes seperately instead of having an overall rating score.
 * 
 * 3. Make it so that only people who you have authorized (maybe someone youve done work for)
 *    can vouch/refute you blockchain experience.
 * 
 * 4. Keep tracks of jobs youve gotten for each specific blockchain. 
 */
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap};
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{env, near_bindgen, setup_alloc, PanicOnDefault, AccountId};

setup_alloc!();

//Json Struct for displaying to Future Frontend
#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonBusinessCard {
    owner_id: AccountId,
    website_url: Option<String>,
    experience: Vec<String>,
}

//A Business card contains Owner ID, Website URL, and Expereince
//Expereience is a set of blockchains youve developed on with rating (given by others)
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct BusinessCard{
    pub owner_id: AccountId,
    pub website_url: Option<String>,
    pub blockchain_exp: LookupMap<AccountId, u32>,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize,PanicOnDefault)]
pub struct Contract{
    pub owner_id: AccountId,
    pub records: LookupMap<AccountId, BusinessCard>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: "juemrami.testnet".to_string(),
            records: LookupMap::new(b"a".to_vec()),
        }
    }
    pub fn set_website(&mut self, url: String) {
        let account_id = env::signer_account_id();
        assert!(url != "", "Url must be non empty.");
        let mut business_card = {
            match self.records.get(&account_id){
                Some(card) => card,
                None => panic!("No business card exists for this account."),
            }
        };
        business_card.website_url = Some(url.clone());
        self.records.insert(&account_id,&business_card );
        env::log(format!("Url: {url} added for account: {account_id}").as_bytes());
        println!("Url: {url} added for account: {account_id}")
    }
    pub fn add_blockchain(&mut self, blockchain_name: String ){
        match blockchain_name.as_ref(){
            "NEAR" => (),
            "Ethereum" => (),
            "Cardano" => (),
            "Solana" => (),
            "Polkadot" => (),
            "Terra" => (),
            "Avalance" => (),
            _=> panic!("Not a valid blockchain: only NEAR, Ethereum, Cardano, Solana, Polkadot, Terra, Avalance."),
        }
        let account_id = env::signer_account_id();
        let mut business_card = {
            match self.records.get(&account_id){
                Some(card) => card,
                None => panic!("No business card exists for this account."),
            }
        };
        let mut blockchain_exp = business_card.blockchain_exp;
        if blockchain_exp.contains_key(&blockchain_name){
            panic!("This blockchain is already associated with this account.");
        }else{ 
            blockchain_exp.insert(&blockchain_name, &0);
            env::log(format!("Experience: {blockchain_name} added for account: {account_id}").as_bytes());
        }
        business_card.blockchain_exp = blockchain_exp;
        self.records.insert(&account_id,&business_card );
        println!("Successfully added {} to {}", &blockchain_name, &account_id);
    }
    pub fn vouch(&mut self, card_owner_id: AccountId, blockchain_name: String){
        match blockchain_name.as_ref(){
            "NEAR" => (),
            "Ethereum" => (),
            "Cardano" => (),
            "Solana" => (),
            "Polkadot" => (),
            "Terra" => (),
            "Avalance" => (),
            _=> panic!("Not a valid blockchain: only NEAR, Ethereum, Cardano, Solana, Polkadot, Terra, Avalance."),
        }
        let mut business_card = {
            match self.records.get(&card_owner_id){
                Some(card) => card,
                None => panic!("No business card exists for this account."),
            }
        };
        let mut blockchain_exp = business_card.blockchain_exp;
        match &blockchain_exp.contains_key(&blockchain_name){
           true => {
               let mut rating = blockchain_exp.get(&blockchain_name).unwrap().clone();
               rating += 1;
               blockchain_exp.insert(&blockchain_name, &rating);
               env::log(format!("{card_owner_id} has recivied a vocuh for {blockchain_name}. New count - {rating}").as_bytes());
           },
            false =>panic!("This account has not add this blockchain to their experience."),
        }
        // These following lines might not be needed.
        // The units test showed that the rating was updating in place (i.e; i didnt have to re-insert)

        // business_card.blockchain_exp = Some(blockchain_exp);
        // self.records.insert(&card_owner_id, &business_card);

    }

    // pub fn refute(&mut self, card_owner_id: AccountId, blockchain_name: String){
    //     match blockchain_name.as_ref(){
    //         "NEAR" => (),
    //         "Ethereum" => (),
    //         "Cardano" => (),
    //         "Solana" => (),
    //         "Polkadot" => (),
    //         "Terra" => (),
    //         "Avalance" => (),
    //         _=> panic!("Not a valid blockchain: only NEAR, Ethereum, Cardano, Solana, Polkadot, Terra, Avalance."),
    //     }
    // }

    #[payable]
    pub fn create_new_card(&mut self) {
        let account_id = env::signer_account_id();
        assert!(self.records.contains_key(&account_id.to_string())==false, "Business card for this account already exists.");
        let _balance = env::attached_deposit();
        let business_card = BusinessCard{
            owner_id: account_id.clone(),
            website_url: None,
            blockchain_exp: LookupMap::new(b"s".to_vec()),
        };
        // Use env::log to record logs permanently to the blockchain!
        env::log(format!("New Business Card created for account:{}", &account_id).as_bytes());
        println!("New Business Card created for account: {account_id}");
        self.records.insert(&account_id,&business_card );
    }

    // `match` is similar to `switch` in other languages.
    // self.records.get(&account_id) is not yet defined.
    // Learn more: https://doc.rust-lang.org/book/ch06-02-match.html#matching-with-optiont
    pub fn get_card(&self, account_id: String) -> BusinessCard {
        match self.records.get(&account_id) {
            Some(card) => card,
            None => panic!("No business card exists for this account.") ,
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

    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, signer_account_id : Option<String>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: {
                match signer_account_id {
                    Some(arg) => arg,
                    None => "bob_near".to_string(),
                }
            },
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }
    #[test]
    #[should_panic(expected=r#"The contract is not initialized"#)]
    fn default_deploy(){

        let context = get_context(vec![], None ,true);
        testing_env!(context);
        let _contract = Contract::default();
    }
    #[test]
    fn get_populated_card(){
        let context = get_context(vec![], None ,false);
        let account_id = &context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let input_url = "www.example.com".to_string();    
        contract.set_website(input_url.clone());
        let input = "NEAR".to_string();
        contract.add_blockchain(input.clone());
        let input = "Ethereum".to_string();      
        contract.add_blockchain(input.clone());

        let context = get_context(vec![], Some("jack_near".to_string()) ,false);
        testing_env!(context);
        contract.vouch("bob_near".to_string(), "NEAR".to_string());

        let business_card = {
            match contract.records.get(&account_id){
                Some(res) => res,
                None => panic!("No Record Found"),
            }
        };
        let blockchain_exp = &business_card.blockchain_exp;
        println!("BusinessCard\n-------------------\nAccount Name: \t {}\nWebsite: \t {}", 
                  &business_card.owner_id, &business_card.website_url.unwrap());
        println!("NEAR: \t {}", &blockchain_exp.get(&"NEAR".to_string()).unwrap());
        println!("Ethereum: \t {}", &blockchain_exp.get(&"Ethereum".to_string()).unwrap());

    }
    #[test]
    fn create_card(){
        let context = get_context(vec![], None ,true);
        let account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let business_card = {
            match contract.records.get(&account_id){
                Some(res) => res,
                None => panic!("No Record Found"),
            }
        };
        assert_eq!(account_id.to_string(), business_card.owner_id.to_string());
    }

    #[test]
    fn set_and_get_url(){
        let context = get_context(vec![], None ,true);
        let account_id = context.signer_account_id.clone();
        testing_env!(context);

        let mut contract = Contract::new();
        contract.create_new_card();
        let input_url = "www.example.com".to_string();    
        contract.set_website(input_url.clone());

        let business_card = {
            match contract.records.get(&account_id){
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
        assert_eq!(output_url, input_url, "URL mismatch {output_url} != {input_url}");
    }
    #[test]
    fn get_and_set_experience(){
        let context = get_context(vec![], None ,true);
        let account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let input = "NEAR".to_string();    
        contract.add_blockchain(input.clone());

        let business_card = {
            match contract.records.get(&account_id){
                Some(res) => res,
                None => panic!("No Record Found"),
            }
        };
        let rating = business_card.blockchain_exp.get(&input).unwrap();
        assert_eq!(rating, 0, "Test Fail, Ratings not equal");

    }
    #[test]
    #[should_panic(expected=r#"Not a valid blockchain: only NEAR, Ethereum, Cardano, Solana, Polkadot, Terra, Avalance."#)]
    fn set_nonexistent_experience(){
        let context = get_context(vec![], None ,true);
        let _account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let input = "TEST123".to_string();    
        contract.add_blockchain(input.clone());
    }
    #[test]
    #[should_panic(expected=r#"No business card exists for this account."#)]
    fn experience_entry_no_card(){
        let context = get_context(vec![], None ,true);
        let _account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        let input = "NEAR".to_string();    
        contract.add_blockchain(input.clone());
    }
    #[test]
    #[should_panic(expected=r#"This blockchain is already associated with this account."#)]
    fn double_entry_experience(){
        let context = get_context(vec![], None ,true);
        let _account_id = context.signer_account_id.clone();
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        let input = "NEAR".to_string();    
        contract.add_blockchain(input.clone());
        contract.add_blockchain(input.clone());
    }
    #[test]
    #[should_panic(expected=r#"Business card for this account already exists."#)]
    fn create_duplicate_card(){
        let context = get_context(vec![], None ,true);
        testing_env!(context);
        let mut contract = Contract::new();
        contract.create_new_card();
        contract.create_new_card();
    }
    #[test]
    #[should_panic(expected=r#"No business card exists for this account."#)]
    fn access_non_existent_card(){
        let context = get_context(vec![], None ,true);
        let account_id = context.signer_account_id.clone(); 
        testing_env!(context);
        let contract = Contract::new();
        contract.get_card(account_id);
    }
    // #[test]
    // fn set_then_get_greeting() {
    //     let context = get_context(vec![], None ,true);
    //     testing_env!(context);
    //     let mut contract = Welcome::new();
    //     contract.set_greeting("howdy".to_string());
    //     assert_eq!(
    //         "howdy".to_string(),
    //         contract.get_greeting("bob_near".to_string())
    //     );
    // }

    // #[test]
    // fn get_empty_feild() {
    //     let context = get_context(vec![], None ,true);
    //     testing_env!(context);
    //     let contract = Welcome::new();
    //     // this test did not call set_greeting so should return the default "Hello" greeting
    //     assert_eq!(
    //         "No Data".to_string(),
    //         contract.get_greeting("francis.near".to_string())
    //     );
    // }
}
