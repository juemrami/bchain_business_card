import React, { useEffect } from "react";
import { Nav } from "../components/Nav";
import { Big } from "big.js";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useNear } from "../context/NearProvider";

// const _contract = dynamic(
//   () => {
//     return import("../depracated__utils/near").then((mod) => mod.contract);
//   },
//   { ssr: false }
// );

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

export function HomePage() {
  let { wallet, currentUserId: currentUser, contract: _contract } = useNear();

  useEffect(() => {
    console.log(`fetching wallet...`);
    if (wallet) {
      console.log(`found`);
      console.log(wallet);
      currentUser || null
        ? console.log(`logged in user key found: ${currentUser}`)
        : console.log(
            `wallet found but no keys for current wallet_connection exist.
             User must log in and save a key.`
          );
    } else {
      console.log(`wallet not found...yet`);
    }
    // console.log(currentUser);
  }, [wallet]);

  let [bchainInput, setBchainInput] = useState("");
  let [websiteInput, setWebsiteInput] = useState("");
  let [card, setCard] = useState({
    blockchain_exp: {},
    owner_id: null,
    website_url: null,
  });
  let [contract, setContract] = useState({
    contractId: null,
  });
  useEffect(() => {
    if (_contract) setContract(_contract);
  }, [_contract]);

  useEffect(() => {
    if (currentUser) {
      console.log(`New Render triggered. Re-fetching business card.`);
      getCard();
    }
  }, [currentUser]);

  const getCard = async () => {
    console.log(`Attempting to get card for ${currentUser}`);
    try {
      const res = await contract.get_card({ account_id: currentUser });
      console.log(res);
      setCard(res);
    } catch (error) {
      console.log(error);
    }
  };
  const newCard = async () => {
    console.log(
      `Creating new Card on  ${contract.contractId} for ${currentUser}`
    );
    if (currentUser == null) {
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
    }
  };
  const addBlockchainExp = async () => {
    console.log(`Attempting to add ${bchainInput} for ${currentUser}`);
    await contract.add_blockchain(
      { blockchain_name: bchainInput },
      BOATLOAD_OF_GAS
    );
    await getCard();
  };
  const addWebsite = async () => {
    console.log(`Attempting to website ${websiteInput} for ${currentUser}`);
    await contract.set_website({ url: websiteInput }, BOATLOAD_OF_GAS);
    await getCard();
  };
  const vouch = async (blockchain) => {
    console.log(`Attempting to vouch for  ${card.owner_id} on ${blockchain}`);
    await contract.vouch(
      { card_owner_id: card.owner_id, blockchain_name: blockchain },
      BOATLOAD_OF_GAS
    );
    await getCard();
  };
  const refute = async (blockchain) => {
    console.log(
      `Attempting to refute ${card.owner_id} on ${blockchain} experience.`
    );
    await contract.refute(
      { card_owner_id: card.owner_id, blockchain_name: blockchain },
      BOATLOAD_OF_GAS
    );
    await getCard();
  };

  return (
    <>
      <main className="container mt-10 ml-10">
        <h1 id="welcome-header" className="text-5xl">
          Welcome,{" "}
          {(currentUser != "") & (currentUser != null) ? (
            <>{currentUser.split(".").shift()}.</>
          ) : (
            <p className=" font-$Times font-black text-xl mt-3 pl-[3px]">
              Please login first at the top right corner.
            </p>
          )}
        </h1>

        {currentUser && (
          <section id="create-card-prompt">
            {card.owner_id == null ? (
              <>
                <p className=" font-$Times font-bg-dark-200 text-xl mt-3 pl-[3px]">
                  {
                    "We dont seem to have any information saved for you. Would you like to deploy a business card to the blockchain?"
                  }
                </p>
                <button
                  className="flex items-center justify-center 
                  font-thin text-white
                  bg-black
                  border-solid rounded-lg border-black border-[2.5px]
                  h-[34px] w-max pb-[2px] pl-[8px] pr-[8px] mt-5
                  hover:(border-black text-black bg-light-600)"
                  onClick={() => newCard()}
                >
                  Create a Business Card
                </button>
              </>
            ) : (
              ""
            )}
          </section>
        )}
        <br></br>
        {card.owner_id && (
          <>
            <div>
              <h3>Your Business Card as JSON</h3>
              <div>{card.owner_id ? JSON.stringify(card) : ""}</div>
              <br></br>
            </div>
            <p>
              I recommend browsing this demo with developer tools open{" "}
              <code>ctrl+shift+i</code> usually{" "}
            </p>
            <p>
              Also be careful with spamming buttons i current have no "loading
              animations" so you might be sending multiple requests
            </p>
            <h2>Update Your Business Card</h2>
            <div>
              <label>
                Try adding a blockchain you've developed on. Or try crashing it.
                <input
                  placeholder="blockchain name"
                  onChange={(e) => setBchainInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setBchainInput(e.target.value);
                    }
                  }}
                />
              </label>
              <button onClick={() => addBlockchainExp()}>add blockchain</button>
            </div>
            <div>
              <label>
                {" "}
                Enter a website to display on your business ward.
                <input
                  placeholder="website url"
                  onChange={(e) => setWebsiteInput(e.target.value)}
                />
              </label>
              <button onClick={() => addWebsite()}>set website</button>
            </div>
            <div>
              <br></br>
              <h2>Claimed Experience</h2>
              <p>
                The idea is that other accounts should be able to judge wether
                or not you posses the skills you claim. but for the purposes of
                this demo you can vouch and refute your own claims{" "}
              </p>
              <>
                <ul>
                  {Object.keys(card.blockchain_exp).map((key, index) => {
                    return (
                      <li key={index}>
                        <h2>{key.toString()}</h2>{" "}
                        <p>Net Vouches: {card.blockchain_exp[key]}</p>
                        <button onClick={() => vouch(key.toString())}>
                          vouch
                        </button>
                        <button onClick={() => refute(key.toString())}>
                          refute
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            </div>
          </>
        )}
      </main>
    </>
  );
}
export default HomePage;
