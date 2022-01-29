import React, { useEffect } from "react";
import { Nav } from "../Nav";
import { contract, wallet } from "../../utils/near";
import { Big } from "big.js";
import { useState } from "react";
import { signIn } from "../Nav";
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

export function App() {
  const currentUser = wallet.getAccountId() || null;
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
    console.log(currentUser);
    if (currentUser == null) {
      await signIn();
      await contract.create_new_card(
        {},
        BOATLOAD_OF_GAS,
        Big(5)
          .times(10 ** 24)
          .toFixed()
      );
    } else {
      await contract.create_new_card(
        {},
        BOATLOAD_OF_GAS,
        Big(5)
          .times(10 ** 24)
          .toFixed()
      );
      console.log(`the contract id is: ${contract.contractId}`);
    }
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
        <>
          {currentUser != null ? (
            <h1>Welcome {currentUser.split(".").shift()}</h1>
          ) : (
            <>
              <h1>Welcome</h1>
              <br></br>
              <p>Please login first at the top right corner.</p>
            </>
          )}
        </>

        {currentUser && (
          <div>
            {card.owner_id == null ? (
              <>
                <p>
                  {
                    "We dont seem to have any information saved for you. Would you like to deploy a business card to the blockchain?"
                  }
                </p>
                <button onClick={() => newCard()}>
                  Create a Business Card
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        )}
        <br></br>
        {card.owner_id && (
          <>
            {/* <div>
              <button onClick={() => getCard()}>get card</button>
              <div>{card.owner_id ? JSON.stringify(card) : ""}</div>
              <br></br>
            </div> */}
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
            <div>
              <br></br>
              <h2>Claimed Experience</h2>
              <>
                {Object.keys(card.blockchain_exp).map((key, index) => {
                  return (
                    <div key={index}>
                      <p>
                        {key.toString()}: {card.blockchain_exp[key]}
                      </p>
                      <button onClick={() => vouch(key.toString())}>
                        vouch
                      </button>
                      <button onClick={() => refute(key.toString())}>
                        refute
                      </button>
                    </div>
                  );
                })}
              </>
            </div>
          </>
        )}
      </main>
    </>
  );
}
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
