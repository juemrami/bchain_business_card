import "tailwindcss/tailwind.css";
import { keyStores, connect, WalletConnection } from "near-api-js";
import { useEffect, useState } from "react";
import Head from "next/head";
import { NearProvider } from "../context/NearProvider";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Business Card</title>
        <meta name="description" content="expose yourself" />
        <link rel="icon" href="../../public/favicon.ico" />
      </Head>
      <NearProvider>
        <Component {...pageProps} />;
      </NearProvider>
    </>
  );
}

export default MyApp;
