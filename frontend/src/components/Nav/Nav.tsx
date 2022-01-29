import React from "react";
// import reactLogo from "./react-logo.svg";
import nearLogo from "./near-logo.svg";
import { contract, wallet } from "../../utils/near";
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
  const currentUser = wallet.getAccountId();
  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>
        <img src={nearLogo} alt="NEAR" /> {"Block Cards"}
      </h1>
      <span>{contract.contractId ? (<>contract id: {contract.contractId}</>): '' }</span>
      <span>
        
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
