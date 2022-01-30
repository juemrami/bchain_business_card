import React, { useContext, useEffect } from "react";
import { Nav } from "../containers/Nav";
//import { contract, wallet } from "../utils/near";
import { Big } from "big.js";
import { useState, createContext } from "react";
import dynamic from "next/dynamic";
import { useNear } from "../context/NearProvider";
import { GetServerSideProps } from "next";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { NearContext } from "../context/NearProvider";
export interface NearProps {
  wallet: any;
}

// const nearCtx = createContext(null);

// function Provider({ children }) {
//   const [near, setNear] = useState(undefined);
//   const [wallet, setWallet] = useState(undefined);
//   const [contract, setContract] = useState(undefined);

//   useEffect(() => {
//     (async function init() {
//       const config = {
//         networkId: "testnet",
//         keyStore: new keyStores.BrowserLocalStorageKeyStore(),
//         nodeUrl: "https://rpc.testnet.near.org",
//         walletUrl: "https://wallet.testnet.near.org",
//         helperUrl: "https://helper.testnet.near.org",
//         explorerUrl: "https://explorer.testnet.near.org",
//         headers: {},
//       };
//       const near_connection = await connect(config);
//       const wallet_connection = new WalletConnection(
//         near_connection,
//         "block-cards"
//       );

//       if (typeof window !== "undefined") {
//         const contract = new Contract(
//           wallet_connection.account(),
//           process.env.NEXT_PUBLIC_CONTRACT_NAME!,
//           {
//             viewMethods: ["get_card"],
//             changeMethods: [
//               "set_website",
//               "add_blockchain",
//               "vouch",
//               "refute",
//               "create_new_card",
//             ],
//           }
//         );
//         setContract(contract);
//       }
//       setNear(near_connection);
//       setWallet(wallet_connection);
//     })();
//   }, []);

//   const context = {
//     near,
//     wallet,
//     contract,
//   };

//   return <nearCtx.Provider value={context}>{children}</nearCtx.Provider>;
// }

export default function Home() {
  const { wallet } = useContext(NearContext);

  let [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    console.log(`fetching wallet...`);
    if (wallet) {
      console.log(`found`);
      console.log(wallet);

      wallet.getAccountId()
        ? setCurrentUser(wallet.getAccountId())
        : console.log(
            `wallet found but no keys for current wallet_connection exist.
             User must log in and save a key.`
          );
    } else {
      console.log(`wallet not found...yet`);
    }
  }, [wallet]);

  

  let [bchainInput, setBchainInput] = useState("");
  let [websiteInput, setWebsiteInput] = useState("");
  let [card, setCard] = useState({
    blockchain_exp: {},
    owner_id: null,
    website_url: null,
  });

  return (
    <>
      <h1 className="text-5xl">{`Hello ${currentUser || ''}`} </h1>
    </>
  );
}

// export default () => {
//   return (
//     <Provider>
//       <Home />
//     </Provider>
//   );
// };
