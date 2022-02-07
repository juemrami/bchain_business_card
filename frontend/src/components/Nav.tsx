import React, { Fragment, useEffect, useState } from "react";
import ErrorIcon from "../public/error-notification.svg";
import NearLogo from "../public/near-logo.svg";
import SearchIcon from "../public/search-icon.svg";
import { useNear } from "../context/NearProvider";
import Image from "next/image";
import ErrorBox from "./ErrorBox";
import { useErrors } from "../context/TransactionProvider";
import Link from "next/link";
import { useRouter } from "next/router";
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
export const Nav = () => {
  let { wallet, contract } = useNear();
  let { errorList } = useErrors();
  let [showErrorBox, setShowErrorBox] = useState(false);
  let [showSearchBox, setShowSearchBox] = useState(false);
  let [searchValue, setSearchValue] = useState("");
  const router = useRouter();
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
        <section
          id="Left"
          className="flex flex-row self-center min-h-max h-full"
        >
          <NearLogo className="min-w-max" height={50} width={50} />
          <Link href="/">
            <h1 className="flex pt-1.5 text-3xl font-extrabold min-w-max font-mono hover:cursor-pointer">
              {"Block Cards"}
            </h1>
          </Link>
          <div
            className=" flex w-full h-full 
          flex justify-center flex-col pr-[30px]"
          >
            <SearchIcon
              className="self-end hover:cursor-pointer "
              height={30}
              width={30}
              onClick={() => setShowSearchBox((prev) => !prev)}
            />
          </div>
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
            <ErrorIcon
              stroke={errorList?.length > 0 ? "#a80c19" : "#6B7280"}
              height={25}
              width={25}
            />
            {errorList?.length > 0 && (
              <p className="text-xs w-max">
                Click to {showErrorBox ? "Hide" : "Show"}
              </p>
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
        className="absolute self-end mt-[75px] mr-[15px]"
      >
        {errorList && showErrorBox && <ErrorBox></ErrorBox>}
      </aside>
      <aside
        id="search-bar-container"
        className="absolute self-start mt-[65px] ml-[35px] 
        "
      >
        {showSearchBox && (
          <>
            <div
              id="input-button-container"
              className="focus:(border-near-blue border-2)
              shadow-xl
              w-max h-max 
              flex grid-cols-2 
              "
            >
              <input
                placeholder="search for an account"
                className={`rounded-lg w-min border-2 border-gray-400 ${
                  errorList
                    ? " focus:border-2 border-danger"
                    : "border-near-blue"
                } rounded-r-[0px] h-[35px] pl-[10px]  outline-none focus:(border-near-blue)`}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    if (searchValue != "") {
                      router.push(`/${searchValue}`);
                    }
                  }
                  if (e.key === "Escape") {
                    setShowSearchBox(false);
                  }
                  console.log(e.code);
                }}
              />
              <button
                className="flex items-center justify-center 
                 text-black
                bg-gray-400
                border-solid rounded-lg  rounded-l-[0px]
                h-[35px] w-max pb-[2px] pl-[8px] pr-[8px]
                hover:(border-black text-black bg-gray-500)"
                onClick={() => router.push(`/${searchValue}`)}
              >
                Enter
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};
