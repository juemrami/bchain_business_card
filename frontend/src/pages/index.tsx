import React, { useEffect } from "react";
import { Big } from "big.js";
import { useState } from "react";
import { useNear } from "../context/NearProvider";
import { BallTriangle } from "react-loading-icons";
import { UserBusinessCard } from "../components/UserBusinessCard";
import ErrorBox from "../components/ErrorBox";
import {
  useContractMethod,
  useErrors,
  useTxnState,
} from "../context/TransactionProvider";
// const _contract = dynamic(
//   () => {
//     return import("../depracated__utils/near").then((mod) => mod.contract);
//   },
//   { ssr: false }
// );
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const styles = {
  button: `flex items-center justify-center 
  font-thin text-white
  bg-black
  border-solid rounded-lg border-black border-[2.5px]
  h-[34px] w-max pb-[2px] pl-[8px] pr-[8px]
  hover:(border-black text-black bg-light-600)`,
  inputButton: `flex items-center justify-center 
  font-thin text-white
  bg-black
  border-solid rounded-lg border-black border-[2.5px] rounded-l-[0px]
  h-[35px] w-max pb-[2px] pl-[8px] pr-[8px]
  hover:(border-black text-black bg-light-600)`,
};
export function HomePage() {
  const { wallet, currentUserId: currentUser, contract } = useNear();
  let { viewFunction, callFunction } = useContractMethod();
  const { loading, data, error } = useTxnState();
  const { errorList } = useErrors();

  useEffect(() => {
    if (wallet) {
      console.log(`found`);
      console.log(wallet);
      if (currentUser || null) {
        console.log(`logged in user key found: ${currentUser}`);
        getCard();
      } else {
        console.log(
          `wallet found but no keys for current wallet_connection exist.
             User must log in and save a key.`
        );
      }
    } else {
      console.log(`wallet not found...yet`);
    }
  }, [wallet]);
  const [bchainInput, setBchainInput] = useState("");
  const [websiteInput, setWebsiteInput] = useState("");
  const [card, setCard] = useState({
    blockchain_exp: {},
    owner_id: null,
    website_url: null,
  });
  useEffect(() => {
    if (currentUser) {
      console.log(`New account decteted. Fetching business card.`);
      getCard();
    }
  }, [currentUser]);
  const getCard = async () => {
    console.log(`Attempting to get card for ${currentUser}`);
    try {
      const res = await viewFunction("get_card", {
        account_id: String(currentUser),
      });
      if (res) {
        setCard(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const newCard = async () => {
    console.log(
      `Creating new Card on  ${contract.contractId} for ${currentUser}`
    );
    await callFunction("create_new_card", {});
    await getCard();
  };
  const addBlockchainExp = async () => {
    console.log(`Attempting to add ${bchainInput} for ${currentUser}`);
  };
  const addWebsite = async () => {
    console.log(`Attempting to website ${websiteInput} for ${currentUser}`);
    await callFunction("set_website", { url: websiteInput });
    await getCard();
  };
  const vouch = async (blockchain) => {
    console.log(`Attempting to vouch for  ${card.owner_id} on ${blockchain}`);
    await callFunction("vouch", {
      card_owner_id: card.owner_id,
      blockchain_name: blockchain,
    });
    await getCard();
  };
  const refute = async (blockchain) => {
    console.log(
      `Attempting to refute ${card.owner_id} on ${blockchain} experience.`
    );
    await callFunction("refute", {
      card_owner_id: card.owner_id,
      blockchain_name: blockchain,
    });
    await getCard();
  };

  if (loading || currentUser === undefined) {
    return (
      <div className="flex justify-center flex-1 h-[calc(100vh-50px)] flex-col items-center">
        <BallTriangle
          fill={error ? "danger" : "near-blue"}
          speed={!error ? 1.5 : 0}
          className=""
        />
      </div>
    );
  }

  return (
    <>
      <main className="container mt-10 ml-10">
        <section id="banner" className="mb-8">
          {loading ? (
            <div className="flex justify-center h-[48px]">
              <BallTriangle
                fill={error ? "danger" : "near-blue"}
                speed={1.2}
                className=""
              />
            </div>
          ) : (
            <>
              <h1 id="welcome-header" className="text-5xl">
                Welcome,{" "}
                {currentUser != "" || currentUser != null ? (
                  <>{currentUser.split(".").shift()}.</>
                ) : (
                  <p className=" font-$Times font-black text-xl mt-3 pl-[3px]">
                    Please login first at the top right corner.
                  </p>
                )}
              </h1>
            </>
          )}
        </section>

        {currentUser && (
          <section id="create-card-prompt">
            {card.owner_id == null ? (
              <>
                <p className=" font-$Times font-bg-dark-200 text-xl mt-3 pl-[3px]">
                  {
                    "We dont seem to have any information saved for you. Would you like to deploy a business card to the blockchain?"
                  }
                </p>
                <button className={styles.button} onClick={() => newCard()}>
                  Create a Business Card
                </button>
              </>
            ) : (
              ""
            )}
          </section>
        )}
        {card.owner_id && (
          <>
            <section id="display-business-card">
              <h1 className="font-mono text-xl">
                Your Business Card &#x1F4C7;{" "}
              </h1>
              <div>
                {card.owner_id ? (
                  <UserBusinessCard card={card}></UserBusinessCard>
                ) : (
                  <BallTriangle></BallTriangle>
                )}
              </div>
            </section>
            <section
              id="demo-description-text"
              className="pt-[1.5rem] text-gray-500"
            >
              <p>
                I{" "}
                {errorList?.length > 0 && (
                  <span className="text-danger font-bold font-lg">HIGHLY </span>
                )}
                recommend browsing this demo with developer tools open.{" "}
                <code className="bg-gray-200 rounded-sm text-black ml-[5px] mr-[5px]">
                  ctrl+shift+i
                </code>{" "}
                usually.{" "}
              </p>
              <p className=" text-gray-500">
                Also be careful with spamming buttons you might be sending
                multiple requests.
              </p>
            </section>
            <section id="update-business-card" className="pt-[1.5rem]">
              <h2 className="font-mono text-xl">
                Update Your Business Card &#x270D;
              </h2>
              <div id="add-blockchain-input" className="grid-rows-2 mt-1">
                <label className="text-gray-500">
                  Try adding a blockchain you've developed on.
                </label>
                <div
                  id="input-button-container"
                  className="focus:(border-near-blue border-2) border w-max h-min flex grid-cols-2 border-gray-200 border-2 rounded-lg"
                >
                  <input
                    placeholder="blockchain name"
                    className={`rounded-lg ${
                      error
                        ? " focus:border-2 border-danger"
                        : "border-near-blue"
                    } rounded-r-[0px] h-[35px] pl-[10px] w-[150px] outline-none focus:(border-2)`}
                    onChange={(e) => {
                      setBchainInput(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addBlockchainExp();
                      }
                    }}
                  />
                  <button
                    className={styles.inputButton}
                    onClick={() => addBlockchainExp()}
                  >
                    add
                  </button>
                </div>
              </div>
              <div id="add-website-input" className="grid-rows-2 mt-2">
                <label className="text-gray-500">
                  Or enter a website to display on your business card.
                </label>
                <div
                  id="input-button-container"
                  className="focus:(border-near-blue border-2) border w-max h-min flex grid-cols-2 border-gray-200 border-2 rounded-lg"
                >
                  <input
                    placeholder="website url"
                    className={`rounded-lg ${
                      error
                        ? " focus:border-2 border-danger"
                        : "border-near-blue"
                    } rounded-r-[0px] h-[35px] pl-[10px] w-[150px] outline-none focus:(border-2)`}
                    onChange={(e) => {
                      setWebsiteInput(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addWebsite();
                      }
                    }}
                  />
                  <button
                    className={styles.inputButton}
                    onClick={() => addWebsite()}
                  >
                    set
                  </button>
                </div>
              </div>
            </section>
            <section id="experience-section" className="pt-[1.5rem]">
              <h2 className="font-mono text-xl">
                Claimed Experience &#x1F4AF;
              </h2>
              <section>
                <p className="text-gray-500">
                  The idea is that other accounts should be able to judge wether
                  or not you posses the skills you claim. but for the purposes
                  of this demo you can vouch and refute your own claims{" "}
                </p>

                <section
                  id="experience-cards"
                  className="grid gap-4 
                grid-flow-row  auto-rows-max auto-cols-max
                grid-cols-3
                pt-3
                w-900px h-max"
                >
                  {Object.keys(card.blockchain_exp).map((key, index) => {
                    return (
                      <li
                        key={`${key}-vote`}
                        className="border-4 rounded-md border-black h-[120px] max-w-[235px]  grid-cols-2 flex justify-between"
                      >
                        <div
                          id="experience-container"
                          className="flex flex-col
                        w-full border-solid  pr-[10px]"
                        >
                          <h2
                            id="blockchain-name"
                            className="
                            flex flex-col
                            border-3 border-black border-t-[0px] border-l-[0px]
                            font-mono font-black text-lg font-extrabold
                            self-center
                            h-min w-full"
                          >
                            <span className="self-center">
                              {key.toString()}
                            </span>
                          </h2>
                          <span
                            className=" text-gray-500
                          self-center mt-5"
                          >
                            Net Vouches:{" "}
                            <span
                              className="pl-1 pr-2 
                            font-mono font-bold text-xl text-black"
                            >
                              {card.blockchain_exp[key]}
                            </span>
                          </span>
                        </div>
                        <div className="flex-col flex w-min justify-between pr-[10px] py-[10px]">
                          <button
                            className={styles.button}
                            onClick={() => vouch(key.toString())}
                          >
                            vouch
                          </button>
                          <button
                            className={styles.button}
                            onClick={() => refute(key.toString())}
                          >
                            refute
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </section>
              </section>
            </section>
          </>
        )}
      </main>
    </>
  );
}
export default HomePage;
