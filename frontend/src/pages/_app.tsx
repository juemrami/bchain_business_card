import "windi.css";
import "../styles/globals.css";
import Head from "next/head";
import { NearProvider } from "../context/NearProvider";
import { Nav } from "../components/Nav";
import TransactionProvider from "../context/TransactionProvider";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Business Card</title>
        <meta name="description" content="expose yourself" charSet="UTF-8" />
        <link rel="icon" href="../../public/favicon.ico" />
      </Head>
      <NearProvider>
        <TransactionProvider>
          <Nav>
            <Component {...pageProps} />
          </Nav>
        </TransactionProvider>
      </NearProvider>
    </>
  );
}

export default MyApp;
