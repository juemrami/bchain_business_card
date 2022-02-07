import React, { useEffect, useState } from "react";
import NearLogo from "../public/near-logo.svg";
import ErrorLogo from "../public/error-notification.svg";
import { useNear } from "../context/NearProvider";
import Image from "next/image";
import ErrorBox from "./ErrorBox";
import { useErrors } from "../context/TransactionProvider";
import Link from "next/link";

export const Nav = () => {
  let { wallet, contract } = useNear();
  let { errorList } = useErrors();
  let [showErrorBox, setShowErrorBox] = useState(false);
  useEffect(() => {}, [wallet]);

  function signIn() {
    wallet.requestSignIn({
      contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
      // pass methodNames to request access to only these
      // (empty array means requesting access to all)
      methodNames: [],
    });
  }

  function signOut() {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  }
  return (
    <div className="flex flex-col">
      <nav
        id="navbar"
        className="grid grid-cols-3 
          items-center gap-1 
          w-full max-h-[55px] h-full 
          shadow-lg col-auto"
      >
        <section id="Left" className="flex flex-row self-center h-full ">
          <NearLogo height={50} width={50} />
          <Link href="/">
            <h1 className="flex pt-1.5 text-3xl font-extrabold font-mono hover:cursor-pointer">
              {"Block Cards"}
            </h1>
          </Link>
        </section>

        <section id="Center" className="max-h-[50px] grid grid-row-2">
          {contract?.contractId ? (
            <>
              <span
                className="self-start justify-self-center 
              max-w-35  font-semibold text-sm font-mono"
              >
                {wallet?.getAccountId() ? (
                  <>
                    Connected to: <span className="text-md">&#x1F91D;</span>{" "}
                  </>
                ) : (
                  <>
                    Connect to?<span className="text-md"> &#x1F914;</span>
                  </>
                )}
              </span>
              <a
                target="_blank"
                className="justify-self-center hover:(underline)"
                href={`https://stats.gallery/testnet/${contract.contractId}/contract`}
              >{`${contract.contractId}`}</a>
            </>
          ) : (
            <></>
          )}
        </section>

        <section
          id="Right"
          className="max-h-[50px] h-full pl-[65px] pr-[30px] w-full
            flex justify-between items-center text-xl 
            "
        >
          <div
            className="hover:cursor-pointer 
            h-[44px] w-[82px]  
            
            flex flex-col items-center justify-center"
            onClick={() => setShowErrorBox((prev) => !prev)}
          >
            <ErrorLogo
              stroke={errorList?.length > 0 ? "#a80c19" : "#6B7280"}
              height={25}
              width={25}
            />
            {errorList?.length > 0 && (
              <p className="text-xs w-max">Click for Errors</p>
            )}
          </div>

          {wallet?.getAccountId() ? (
            <button
              className="flex items-center justify-center 
              font-thin text-white
              bg-black
              border-solid rounded-lg border-black border-[2px]
              h-[30px] w-[90px] pb-[2px]
              hover:(border-danger  text-danger font-semibold bg-light-600)"
              onClick={signOut}
            >
              Sign Out
            </button>
          ) : (
            <button
              className="flex items-center justify-center 
              font-thin text-white
              bg-black
              border-solid rounded-lg border-black border-[2px]
              h-[30px] w-[90px] pb-[2px]
              hover:(border-near-blue text-near-blue font-semibold bg-light-600)"
              onClick={signIn}
            >
              Sign in
            </button>
          )}
        </section>
      </nav>
      <aside
        id="error-container"
        className={`absolute self-end mt-[65px] mr-[15px] ${
          showErrorBox ? "visible" : "invisible"
        }`}
      >
        {errorList && <ErrorBox errorList={errorList}></ErrorBox>}
      </aside>
    </div>
  );
};
