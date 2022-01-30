import React, { useEffect } from "react";
import { Nav } from "../containers/Nav";
//import { contract, wallet } from "../utils/near";
import { Big } from "big.js";
import { useState } from "react";

import dynamic from "next/dynamic";
import { useNear } from "../context/NearProvider";

const contract = dynamic(
  () => {
    return import("../utils/near").then((mod) => mod.contract);
  },
  { ssr: false }
);
const wallet = dynamic(
  () => {
    return import("../utils/near").then((mod) => mod.wallet);
  },
  { ssr: false }
);
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

export function HomePage() {
  let currentUser;
  let { wallet } = useNear();
  useEffect(() => {
    console.log("initializing connection");
    currentUser = wallet.getAccountId() || null;
  }, [0]);
  let [bchainInput, setBchainInput] = useState("");
  let [websiteInput, setWebsiteInput] = useState("");
  let [card, setCard] = useState({
    blockchain_exp: {},
    owner_id: null,
    website_url: null,
  });

  // useEffect(() => {
  //   if (currentUser) {
  //     console.log(`New Render triggered. Re-fetching business card.`);
  //     getCard();
  //   }
  // }, [currentUser]);
  // const getCard = async () => {
  //   console.log(`Attempting to get card for ${currentUser}`);
  //   const res = await contract.get_card({ account_id: currentUser });
  //   console.log(res);
  //   //debugger;
  //   setCard(res);
  // };
  // const newCard = async () => {
  //   console.log(
  //     `Creating new Card on  ${contract.contractId} for ${currentUser}`
  //   );
  //   if (currentUser == null) {
  //     await contract.create_new_card(
  //       {},
  //       BOATLOAD_OF_GAS,
  //       Big(5)
  //         .times(10 ** 24)
  //         .toFixed()
  //     );
  //   } else {
  //     await contract.create_new_card(
  //       {},
  //       BOATLOAD_OF_GAS,
  //       Big(5)
  //         .times(10 ** 24)
  //         .toFixed()
  //     );
  //   }
  // };
  // const addBlockchainExp = async () => {
  //   console.log(`Attempting to add ${bchainInput} for ${currentUser}`);
  //   await contract.add_blockchain(
  //     { blockchain_name: bchainInput },
  //     BOATLOAD_OF_GAS
  //   );
  //   await getCard();
  // };
  // const addWebsite = async () => {
  //   console.log(`Attempting to website ${websiteInput} for ${currentUser}`);
  //   await contract.set_website({ url: websiteInput }, BOATLOAD_OF_GAS);
  //   await getCard();
  // };
  // const vouch = async (blockchain) => {
  //   console.log(`Attempting to vouch for  ${card.owner_id} on ${blockchain}`);
  //   await contract.vouch(
  //     { card_owner_id: card.owner_id, blockchain_name: blockchain },
  //     BOATLOAD_OF_GAS
  //   );
  //   await getCard();
  // };
  // const refute = async (blockchain) => {
  //   console.log(
  //     `Attempting to refute ${card.owner_id} on ${blockchain} experience.`
  //   );
  //   await contract.refute(
  //     { card_owner_id: card.owner_id, blockchain_name: blockchain },
  //     BOATLOAD_OF_GAS
  //   );
  //   await getCard();
  // };
  return (
    <>
      <h1>Welcome</h1>
    </>
  );
  // return (
  //   <>
  //     <Nav />
  //     <main className="container">
  //       <>
  //         {currentUser != null ? (
  //           <h1>Welcome {currentUser.split(".").shift()}</h1>
  //         ) : (
  //           <>
  //             <h1>Welcome</h1>
  //             <br></br>
  //             <p>Please login first at the top right corner.</p>
  //           </>
  //         )}
  //       </>

  //       {currentUser && (
  //         <div>
  //           {card.owner_id == null ? (
  //             <>
  //               <p>
  //                 {
  //                   "We dont seem to have any information saved for you. Would you like to deploy a business card to the blockchain?"
  //                 }
  //               </p>
  //               <button onClick={() => newCard()}>
  //                 Create a Business Card
  //               </button>
  //             </>
  //           ) : (
  //             ""
  //           )}
  //         </div>
  //       )}
  //       <br></br>
  //       {card.owner_id && (
  //         <>
  //           <div>
  //             <h3>Your Business Card as JSON</h3>
  //             <div>{card.owner_id ? JSON.stringify(card) : ""}</div>
  //             <br></br>
  //           </div>
  //           <p>
  //             I recommend browsing this demo with developer tools open{" "}
  //             <code>ctrl+shift+i</code> usually{" "}
  //           </p>
  //           <p>
  //             Also be careful with spamming buttons i current have no "loading
  //             animations" so you might be sending multiple requests
  //           </p>
  //           <h2>Update Your Business Card</h2>
  //           <div>
  //             <label>
  //               Try adding a blockchain you've developed on. Or try crashing it.
  //               <input
  //                 placeholder="blockchain name"
  //                 onChange={(e) => setBchainInput(e.target.value)}
  //                 onKeyPress={(e) => {
  //                   if (e.key === "Enter") {
  //                     setBchainInput(e.target.value);
  //                   }
  //                 }}
  //               />
  //             </label>
  //             <button onClick={() => addBlockchainExp()}>add blockchain</button>
  //           </div>
  //           <div>
  //             <label>
  //               {" "}
  //               Enter a website to display on your business ward.
  //               <input
  //                 placeholder="website url"
  //                 onChange={(e) => setWebsiteInput(e.target.value)}
  //               />
  //             </label>
  //             <button onClick={() => addWebsite()}>set website</button>
  //           </div>
  //           <div>
  //             <br></br>
  //             <h2>Claimed Experience</h2>
  //             <p>
  //               The idea is that other accounts should be able to judge wether
  //               or not you posses the skills you claim. but for the purposes of
  //               this demo you can vouch and refute your own claims{" "}
  //             </p>
  //             <>
  //               <ul>
  //                 {Object.keys(card.blockchain_exp).map((key, index) => {
  //                   return (
  //                     <li key={index}>
  //                       <h2>{key.toString()}</h2>{" "}
  //                       <p>Net Vouches: {card.blockchain_exp[key]}</p>
  //                       <button onClick={() => vouch(key.toString())}>
  //                         vouch
  //                       </button>
  //                       <button onClick={() => refute(key.toString())}>
  //                         refute
  //                       </button>
  //                     </li>
  //                   );
  //                 })}
  //               </ul>
  //             </>
  //           </div>
  //         </>
  //       )}
  //     </main>
  //   </>
  // );
}
