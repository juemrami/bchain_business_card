import React, { useEffect } from "react";
import nearLogo from "../public/near-logo.svg";
import { useNear } from "../context/NearProvider";
import Image from "next/image";
import { Console } from "console";

export const Nav = () => {
  let { wallet, contract } = useNear();
  useEffect(() => {
    console.log(wallet);
  }, [wallet]);

  function signIn() {
    console.log();
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
    <nav
      id="3-Element-Navbar"
      className="grid grid-cols-3 
        items-center gap-1 
        w-full max-h-[55px] h-full 
        shadow-lg col-auto"
    >
      <section id="Left" className="flex flex-row self-center h-full">
        <Image className="flex" src={nearLogo} height={50} width={50} />
        <h1 className="flex pt-1.5 text-3xl font-extrabold font-mono">
          {"Block Cards"}
        </h1>
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
        className="max-h-[50px] h-full pr-[40px] 
          flex items-center justify-end  text-xl 
          "
      >
        {wallet?.getAccountId() ? (
          <button
            className="flex items-center justify-center 
            font-thin text-white
            bg-black
            border-solid rounded-w-lg border-black border-2
            h-[34px] w-[110px] pb-[2px]
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
            border-solid rounded-lg border-black border-[2.5px]
            h-[34px] w-[110px] pb-[2px]
            hover:(border-near-blue text-near-blue font-semibold bg-light-600)"
            onClick={signIn}
          >
            Sign in
          </button>
        )}
      </section>
    </nav>
  );
};
