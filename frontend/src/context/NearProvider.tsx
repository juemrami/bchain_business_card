// Packages //
import { useState, useEffect, useContext, createContext, Context } from "react";
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

  const viewMethods = ["get_card"];
  const changeMethods = [
    "set_website",
    "add_blockchain",
    "vouch",
    "refute",
    "create_new_card",
  ];

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
      const wallet_connection = new WalletConnection(
        near_connection,
        process.env.NEXT_PUBLIC_CONTRACT_LOCALSTORAGE_PREFIX
      );

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
      setCurrentUserId(wallet_connection.getAccountId());
      setNear(near_connection);
      setWallet(wallet_connection);
    })();
  }, []);

  const viewFunction = async (functionName, args = {}) => {
    // console.log(viewMethods);
    // console.log(functionName);

    if (!viewMethods.includes(functionName)) {
      // console.log("function not found");
      return Error("function not found");
    }

    const result = await wallet
      .account()
      .viewFunction(process.env.NEXT_PUBLIC_CONTRACT_NAME, functionName, args);

    return result;
  };

  const callFunction = async (functionName, args = {}, deposit = "0") => {
    if (!changeMethods.includes(functionName)) {
      // console.log("function not found");
      throw new Error(`Function not found: "${functionName}".`);
    }

    const result = await wallet.account().functionCall({
      contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
      methodName: functionName,
      args: args,
      attachedDeposit: utils.format.parseNearAmount(deposit),
    });
    return result;
  };
  const context = {
    near,
    wallet,
    contract,
    currentUserId,
    viewFunction,
    callFunction,
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
