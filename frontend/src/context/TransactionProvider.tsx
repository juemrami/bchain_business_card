import { utils } from "near-api-js";
import React, { createContext, useContext, useEffect, useState } from "react";
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

interface ErrorContext {
  errorList?: Error[];
  clearError?: (arg1: number, arg2?: boolean) => void;
}

export const TransactionContext = createContext<TransactionContext>({});
const MethodContext = createContext<MethodContext>({});
const ErrorContext = createContext<ErrorContext>({});

export function useContractMethod() {
  return useContext(MethodContext);
}
export function useTxnState() {
  return useContext(TransactionContext);
}
export function useErrors() {
  return useContext(ErrorContext);
}
const TransactionProvider = ({ children }) => {
  let { wallet } = useNear();
  let [error, setError] = useState(undefined);
  let [loading, setLoading] = useState(false);
  let [data, setData] = useState(undefined);
  let [errorList, setErrorList] = useState<Error[]>(undefined);

  let clearError = (index?: number, clearAll = false) => {
    if (clearAll) {
      setErrorList([]);
    } else {
      setErrorList((prev) =>
        prev.filter((e, element_index, a) => element_index != index)
      );
    }
  };

  //error management useEffect()
  useEffect(() => {
    // console.log(error);
    // console.log(errorList);
    if (!errorList?.includes(error) && error) {
      console.log(`pushing error: ${error.message}`);
      // console.log(error);
      setErrorList((prev) => [...(prev || []), error]);
    }
  }, [error]);

  useEffect(() => {
    setError(undefined);
    setErrorList(undefined);
  }, [errorList?.length == 0]);

  async function viewFunction(functionName, args = {}) {
    console.log(`View function called: ${functionName}`);
    // setError(undefined);
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
      setData(result);
      setLoading(false);
      return result;
    } catch (error) {
      setError(error);
      setData(undefined);
    }
    setLoading(false);
  }

  async function callFunction(functionName, args = {}, deposit = "0") {
    console.log("call function called");
    // setError(undefined);
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
      setData(result);
    } catch (error) {
      setError(error);
      setData(undefined);
    }
    setLoading(false);
  }

  const txnContext = { loading, data, error };
  const methodContext = { viewFunction, callFunction };
  const errorsContext = { errorList, clearError };

  return (
    <TransactionContext.Provider value={txnContext}>
      <MethodContext.Provider value={methodContext}>
        <ErrorContext.Provider value={errorsContext}>
          {children}
        </ErrorContext.Provider>
      </MethodContext.Provider>
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
