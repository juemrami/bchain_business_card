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
export interface NearProps {
  wallet: any;
}

export default function Home() {
  const { wallet, currentUserId, contract } = useNear();
  let [errorFlag, setErrorFlag] = useState(false);
  useEffect(() => {
    console.log(`fetching wallet...`);
    if (wallet) {
      console.log(`found`);
      console.log(wallet);
      currentUserId
        ? console.log(`logged in user key found: ${currentUserId}`)
        : console.log(
            `wallet found but no keys for current wallet_connection exist.
             User must log in and save a key.`
          );
    } else {
      console.log(`wallet not found...yet`);
    }

    console.log(contract);
  }, [wallet]);

  useEffect(() => {
    if (contract) {
      getCard();
    }
  }, [contract]);
  //This will only save one error
  let [err, setErr] = useState(null);
  const getCard = async () => {
    console.log(`Attempting to get card for ${null}`);
    try {
      const res = await contract.get_card({ account_id: "dne" });
      if (res) {
        setCard(res);
      }
    } catch (error) {
      console.log("error caught");
      setErrorFlag(true);
      setErr(error);
    }
  };
  useEffect(() => {}, [err]);

  let [bchainInput, setBchainInput] = useState("");
  let [websiteInput, setWebsiteInput] = useState("");
  let [card, setCard] = useState({
    blockchain_exp: {},
    owner_id: null,
    website_url: null,
  });

  return (
    <>
      <h1 className="text-5xl">{`Hello ${currentUserId || ""}`} </h1>
      <div className="mt-[2rem] text-lg border-solid border-black border-4 w-[30rem] h-80">
        {contract?.contractId}
      </div>
      {err && (
        <ErrorBox
          error={err}
          errorClear={() => {
            setErrorFlag(false);
          }}
        ></ErrorBox>
      )}
    </>
  );
}
