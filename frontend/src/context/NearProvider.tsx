// Packages //
import { useState, useEffect, useContext, createContext, Context } from "react";
import ReactDOM from "react-dom";
import {
  keyStores,
  connect,
  WalletConnection,
  Near,
  Contract,
  utils,
} from "near-api-js";

interface NearContext {
  near: Near;
  wallet: WalletConnection;
  contract?: Contract;
  currentUserId?: String;
  viewFunction?: (functionName: any, args: {}) => Promise<any>;
  callFunction?: (
    functionName: any,
    args: {},
    deposit?: string
  ) => Promise<any>;
}

export const NearContext = createContext<NearContext>({
  near: null,
  wallet: null,
  contract: null,
});
export const viewMethods = ["get_card"];
export const changeMethods = [
  "set_website",
  "add_blockchain",
  "vouch",
  "refute",
  "create_new_card",
];

export function NearProvider({ children }) {
  const [near, setNear] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [contract, setContract] = useState<Contract>(undefined);
  const [currentUserId, setCurrentUserId] = useState(undefined);

  useEffect(() => {
    (async function init() {
      const config = {
        networkId: process.env.NEXT_PUBLIC_NEAR_ENV,
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
        walletUrl: process.env.NEXT_PUBLIC_WALLET_URL,
        helperUrl: process.env.NEXT_PUBLIC_HELPER_URL,
        explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL,
        headers: {},
      };
      const near_connection = await connect(config);
      console.log(`fetching wallet...`);
      const wallet_connection = new WalletConnection(
        near_connection,
        process.env.NEXT_PUBLIC_CONTRACT_LOCALSTORAGE_PREFIX
      );
      if (wallet_connection) {
        console.log("wallet found", wallet_connection);
      }

      if (typeof window !== "undefined") {
        const contract = new Contract(
          wallet_connection.account(),
          process.env.NEXT_PUBLIC_CONTRACT_NAME!,
          {
            viewMethods: viewMethods,
            changeMethods: changeMethods,
          }
        );
        setContract(contract);
      }

      ReactDOM.unstable_batchedUpdates(() => {
        setNear(near_connection);
        setWallet(wallet_connection);
        setCurrentUserId(wallet_connection.getAccountId());
      });
    })();
  }, []);

  const context = {
    near,
    wallet,
    contract,
    currentUserId,
  };

  return (
    <>
      <NearContext.Provider value={context}>{children}</NearContext.Provider>
    </>
  );
}
export function useNear() {
  return useContext(NearContext);
}
