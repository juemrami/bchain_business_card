import * as near_api from "near-api-js";
import dynamic from "next/dynamic";

// TODO: remove pending https://github.com/near/near-api-js/issues/757

const Buffer: any = dynamic(
  (): any => {
    return import("buffer").then((mod) => mod.Buffer);
  },
  { ssr: false }
);

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}
/**
 * NEAR Config object
 */
export const near = new near_api.Near({
  keyStore: new near_api.keyStores.BrowserLocalStorageKeyStore(),
  networkId: process.env.NEXT_PUBLIC_NEAR_NETWORK!,
  nodeUrl: process.env.NEXT_PUBLIC_RPC_URL!,
  walletUrl: process.env.NEXT_PUBLIC_WALLET_URL,
  helperUrl: process.env.NEXT_PUBLIC_HELPER_URL,

  // TODO: remove `headers` argument pending https://github.com/near/near-api-js/pull/772
  headers: {},
});

/**
 * Interface to NEAR Wallet
 */
export const wallet = new near_api.WalletConnection(
  near,

  // TODO: remove this second argument to WalletConnection pending https://github.com/near/near-api-js/pull/772
  process.env.NEXT_PUBLIC_LOCALSTORAGE_PREFIX!
);

/**
 * Interface to a contract.
 *
 * If you're familiar with ABIs in Ethereum: sorry, NEAR doesn't have them! (yet)
 *
 * You need to know the contract's interface. When you instantiate the contract
 * here, you can specify view methods (those you'd check with `near view` in
 * NEAR CLI) and change methods (those you'd call with `near call` in NEAR CLI).
 *
 * You can always skip instantiating a `naj.Contract` altogether and call
 * `wallet.account().viewFunction()` and `wallet.account().functionCall()`
 * directly. This is what `naj.Contract` does under the hood, and these
 * lower-level functions have more explicit (and typed!) APIs.
 */

export const contract = new near_api.Contract(
  wallet.account(),
  process.env.NEXT_PUBLIC_CONTRACT_NAME!,
  {
    viewMethods: ["get_card"],
    changeMethods: [
      "set_website",
      "add_blockchain",
      "vouch",
      "refute",
      "create_new_card",
    ],
  }
);
// export interface contractInterface extends Contract{
//   set_website:(any) => void,
//   add_blockchain:(any) => void,
//   vouch: (any) => void,
//   refute: (any) => void,
//   create_new_card:(any) => void,
//   get_card: (any) => any,
// }
