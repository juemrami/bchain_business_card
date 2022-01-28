import React, { useEffect } from "react";
import { Nav } from "../Nav";
import { contract, wallet } from "../../utils/near";
import PropTypes from "prop-types";
import { Contract } from "near-api-js";
import { Big } from "big.js";
import { useState } from "react";
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();
// export interface contractInterface extends Contract{
//   set_website:() => void,
//   add_blockchain:() => void,
//   vouch: () => void,
//   refute: () => void,
//   create_new_card:(any) => void,
//   get_card: () => any,
// }

export function App() {
  const currentUser = wallet.getAccountId();
  let [bchainInput, setBchainInput] = useState("");
  let [websiteInput, setWebsiteInput] = useState("");
  let [card, setCard] = useState({
    blockchain_exp: {},
    owner_id: null,
    website_url: null,
  });
  useEffect(() => {
    if (currentUser) {
      getCard();
    }
  }, []);
  const getCard = async () => {
    console.log("trying to get card");
    const res = await contract.get_card({ account_id: currentUser });
    console.log(res);
    //debugger;
    setCard(res);
  };
  const newCard = async () => {
    await contract.create_new_card(
      {},
      BOATLOAD_OF_GAS,
      Big(5)
        .times(10 ** 24)
        .toFixed()
    );
    console.log(`the contract id is: ${contract.contractId}`);
  };
  const addBlockchainExp = async () => {
    await contract.add_blockchain(
      { blockchain_name: bchainInput },
      BOATLOAD_OF_GAS
    );
    await getCard();
  };
  const addWebsite = async () => {
    await contract.set_website({ url: websiteInput }, BOATLOAD_OF_GAS);
    await getCard();
  };
  const vouch = async (blockchain) => {
    await contract.vouch(
      { card_owner_id: card.owner_id, blockchain_name: blockchain },
      BOATLOAD_OF_GAS
    );
    await getCard();
  };
  const refute = async (blockchain) => {
    await contract.refute(
      { card_owner_id: card.owner_id, blockchain_name: blockchain },
      BOATLOAD_OF_GAS
    );
    await getCard();
  };
  return (
    <>
      <Nav />
      <main className="container">
        <h1>
          Welcome<> {currentUser ? currentUser.split(".").shift() : ""}</>
        </h1>
        <div>
          {card.owner_id == null ? (
            <button onClick={() => newCard()}>Create a Business Card</button>
          ) : (
            ""
          )}
        </div>
        <br></br>
        <div>
          <button onClick={() => getCard()}>get card</button>
          <div>{card.owner_id ? JSON.stringify(card) : ""}</div>
          <br></br>
        </div>
        <div>
          <input
            placeholder="blockchain name"
            onChange={(e) => setBchainInput(e.target.value)}
          />
          <button onClick={() => addBlockchainExp()}>add blockchain</button>
        </div>
        <div>
          <input
            placeholder="website url"
            onChange={(e) => setWebsiteInput(e.target.value)}
          />
          <button onClick={() => addWebsite()}>set website</button>
        </div>
        {card.owner_id && (
          <div>
            <br></br>
            <h2>Claimed Experience</h2>
            <>
              {Object.keys(card.blockchain_exp).map((key, index) => {
                return (
                  <div id={index}>
                    <p>
                      {key.toString()}: {card.blockchain_exp[key]}
                    </p>
                    <button onClick={() => vouch(key.toString())}>vouch</button>
                    <button onClick={() => refute(key.toString())}>
                      refute
                    </button>
                  </div>
                );
              })}
            </>
          </div>
        )}
      </main>
    </>
  );
}
// export interface contractInterface {
//   set_website:() => void,
//   add_blockchain:() => void,
//   vouch: () => void,
//   refute: () => void,
//   creat_new_card:() => void,
//   get_card: () => any,
// }
// App.propTypes = {
//   contract: PropTypes.shape({
//     set_website: PropTypes.func.isRequired,
//     add_blockchain: PropTypes.func.isRequired,
//     vouch: PropTypes.func.isRequired,
//     creat_new_card: PropTypes.func.isRequired,
//     get_card: PropTypes.func.isRequired,
//   }).isRequired,
//   currentUser: PropTypes.shape({
//     accountId: PropTypes.string.isRequired,
//     balance: PropTypes.string.isRequired,
//   }),
//   wallet: PropTypes.shape({
//     requestSignIn: PropTypes.func.isRequired,
//     signOut: PropTypes.func.isRequired,
//   }).isRequired,
// };
