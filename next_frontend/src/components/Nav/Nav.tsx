import React, { useEffect } from "react";
// import reactLogo from "./react-logo.svg";
import nearLogo from "./near-logo.svg";
import { contract, initNear, wallet } from "../../utils/_near";
// import pkg from "../../../package.json";
import styles from "./Nav.module.css";

export function signIn() {
  wallet.requestSignIn({
    contractId: process.env.REACT_APP_CONTRACT_NAME,
    // pass methodNames to request access to only these
    // (empty array means requesting access to all)
    methodNames: [],
  });
}

function signOut() {
  wallet.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
}

export function Nav() {

  let currentUser;
  useEffect(() => {
    console.log("initializing connection")
    initNear();
    currentUser = wallet.getAccountId() || null
  }, [0]); 

  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>
        <img src={nearLogo} alt="NEAR" /> {"Block Cards"}
      </h1>
      <span>
        {contract.contractId ? (<>contract id: {contract.contractId}</>): '' }
        {currentUser ? (
          <>
            {currentUser} <button onClick={signOut}>Sign Out</button>
          </>
        ) : (
          <button onClick={signIn}>Sign In</button>
        )}
      </span>
    </nav>
  );
}
