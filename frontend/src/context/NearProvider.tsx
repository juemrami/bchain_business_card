// Packages //
import { useState, useEffect, useContext, createContext, Context } from 'react'
import {
  keyStores,
  connect,
  WalletConnection,
  Near,
  Contract,
  utils,
} from 'near-api-js'

interface NearContext {
  near: Near
  wallet: WalletConnection
  contract?: Contract
  currentUserId?: String
}
export const NearContext = createContext<NearContext>({
  near: null,
  wallet: null,
  contract: null,
})

export function useNear() {
  return useContext(NearContext)
}

export function NearProvider({ children }) {
  const [near, setNear] = useState(undefined)
  const [wallet, setWallet] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [currentUserId, setCurrentUserId] = useState(undefined)

  useEffect(() => {
    (async function init() {
      const config = {
        networkId: process.env.NEXT_PUBLIC_NEAR_ENV,
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
        walletUrl: process.env.NEXT_PUBLIC_WALLET_URL,
        helperUrl: process.env.NEXT_PUBLIC_HELPER_URL,
        explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL,
        headers: {},
      }
      const near_connection = await connect(config)
      const wallet_connection = new WalletConnection(
        near_connection,
        process.env.NEXT_PUBLIC_CONTRACT_LOCALSTORAGE_PREFIX,
      )

      if (typeof window !== 'undefined') {
        const contract = new Contract(
          wallet_connection.account(),
          process.env.NEXT_PUBLIC_CONTRACT_NAME!,
          {
            viewMethods: ['get_card'],
            changeMethods: [
              'set_website',
              'add_blockchain',
              'vouch',
              'refute',
              'create_new_card',
            ],
          },
        )
        setContract(contract)
      }
      setCurrentUserId(wallet_connection.getAccountId())
      setNear(near_connection)
      setWallet(wallet_connection)
    })()
  }, [])

  const context = {
    near,
    wallet,
    contract,
    currentUserId,
  }

  const viewFunction = async (functionName, args = {}) => {
    const result = await wallet
      .account()
      .viewFunction(process.env.NEXT_PUBLIC_CONTRACT_NAME, functionName, args)

    return result
  }

  const callFunction = async (functionName, args = {}, deposit = '0') => {
    const result = await wallet.account().functionCall({
      contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
      methodName: functionName,
      args: args,
      attachedDeposit: utils.format.parseNearAmount(deposit),
    })
    return result
  }

  return (
    <>
      <NearContext.Provider value={context}>{children}</NearContext.Provider>
    </>
  )
}
