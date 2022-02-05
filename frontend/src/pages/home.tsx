import React, { useContext, useEffect } from "react";
import { Nav } from "../components/Nav";
//import { contract, wallet } from "../utils/near";
import { Big } from "big.js";
import { useState, createContext } from "react";
import dynamic from "next/dynamic";
import { useNear } from "../context/NearProvider";
import { GetServerSideProps } from "next";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { NearContext } from "../context/NearProvider";
import ErrorBox from "../components/ErrorBox";
import { UserBusinessCard } from "../components/UserBusinessCard";
import { useContractMethod, useTxnState } from "../context/TransactionProvider";
import { BallTriangle } from "react-loading-icons";

export interface NearProps {
  wallet: any;
}
export default function Home() {
  let [bchainInput, setBchainInput] = useState("");
  let [websiteInput, setWebsiteInput] = useState("");
  let [card, setCard] = useState({
    blockchain_exp: {},
    owner_id: null,
    website_url: null,
  });
  const { wallet, currentUserId, contract } = useNear();
  const { viewFunction, callFunction } = useContractMethod();
  const { loading, data, error } = useTxnState();

  const [errorList, setErrorList] = useState([]);

  //wallet watch useEffect
  useEffect(() => {
    console.log(`rendering page... or wallet changed`);
    if (wallet) {
      console.log(`wallet found`);
      console.log(wallet);
      currentUserId
        ? console.log(`logged in user key found: ${currentUserId}`)
        : console.log(
            `wallet found but no keys for current wallet_connection exist.
             User must log in and save a key.`
          );
    } else {
      console.log(`wallet not found/loaded...yet`);
    }
  }, [wallet]);

  //pull new card on new walletAccountId
  useEffect(() => {
    if (contract) {
      getCard();
    }
  }, [wallet?.getAccountId()]);

  //error management useEffect()
  useEffect(() => {
    console.log(error);
    if (!errorList.includes(error) && error) {
      console.log("pushing error");
      setErrorList([...errorList, error]);
    }
  }, [error]);
  useEffect(() => {
    console.log(errorList);
  }, [errorList]);

  const getCard = async () => {
    console.log(`Attempting to get card for ${currentUserId}`);
    await callFunction("get_card", { account_id: currentUserId });
    if (data) {
      setCard(data);
    }
    if (error) {
      console.log(error);
    }
  };

  const newfunc = async () => {
    await viewFunction("get_card", { account_id: "null" });
  };
  useEffect(() => {
    newfunc();
  }, []);
  return (
    <>
      <div>
        {errorList.map((error) => (
          <ErrorBox
            key={error.message}
            error={error}
            errorClear={(elementError) => {
              setErrorList((prev) => prev.filter((x) => x != elementError));
            }}
          />
        ))}
      </div>

      {/* <div>{errorList[0]}</div> */}

      {/* {error && (
        <ErrorBox
          key={error.message}
          error={error}
          errorClear={(elementError) => {
            errorList.filter((x) => x != elementError);
          }}
        />
      )} */}

      <h1 className="text-5xl">{`Hello ${currentUserId || ""}`} </h1>
      {loading && (
        <BallTriangle
          fill={error ? "danger" : "near-blue"}
          speed={error ? 0 : 1.5}
          className=""
        />
      )}
      {data && (
        <div className="mt-[2rem]">
          <UserBusinessCard card={card}></UserBusinessCard>
        </div>
      )}
    </>
  );
}
