import { utils } from "near-api-js";
import React, { createContext, useContext, useState } from "react";
import { viewMethods, changeMethods, useNear } from "./NearProvider";

interface TransactionContext {
  loading?: boolean;
  data?: any;
  error?: Error;
}
interface MethodContext {
  viewFunction?: (functionName: any, args: {}) => Promise<any>;
  callFunction?: (
    functionName: any,
    args: {},
    deposit?: string
  ) => Promise<any>;
}

export const TransactionContext = createContext<TransactionContext>({});
const MethodContext = createContext<MethodContext>({});

export function useContractMethod() {
  return useContext(MethodContext);
}
export function useTxnState() {
  return useContext(TransactionContext);
}
const TransactionProvider = ({ children }) => {
  let { wallet } = useNear();
  let [error, setError] = useState(undefined);
  let [loading, setLoading] = useState(false);
  let [data, setData] = useState(undefined);

  async function viewFunction(functionName, args = {}) {
    console.log("view function called");
    setError(undefined);
    setLoading(true);
    if (!viewMethods.includes(functionName)) {
      setError(Error(`Function not found: "${functionName}".`));
      setLoading(false);
      setData(undefined);
      return;
    }
    try {
      const result = await wallet
        .account()
        .viewFunction(
          process.env.NEXT_PUBLIC_CONTRACT_NAME,
          functionName,
          args
        );
      setLoading(false);
      setData(result);
    } catch (error) {
      setError(error);
      setLoading(false);
      setData(undefined);
    }
  }

  async function callFunction(functionName, args = {}, deposit = "0") {
    console.log("call function called");
    setError(undefined);
    setLoading(true);
    if (!changeMethods.includes(functionName)) {
      console.log("hello");
      setError(Error(`Function not found: "${functionName}".`));
      setLoading(false);
      setData(undefined);
      return;
    }
    try {
      const result = await wallet.account().functionCall({
        contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        methodName: functionName,
        args: args,
        attachedDeposit: utils.format.parseNearAmount(deposit),
      });
      setLoading(false);
      setData(result);
    } catch (error) {
      setError(error);
      setLoading(false);
      setData(undefined);
    }
  }

  const txnContext = { loading, data, error };
  const methodContext = { viewFunction, callFunction };

  return (
    <TransactionContext.Provider value={txnContext}>
      <MethodContext.Provider value={methodContext}>
        {children}
      </MethodContext.Provider>
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
