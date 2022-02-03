import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useNear } from "../../context/NearProvider";
import { BallTriangle } from "react-loading-icons";
import { useEffect } from "react";
import { Contract } from "near-api-js";
import { UserBusinessCard } from "../../components/UserBusinessCard";
import { Big } from "big.js";
import ErrorBox from "../../components/ErrorBox";

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();
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
const viewUserPage = (props) => {
  console.log(props);
  let { owner_id } = props;
  let { contract: _contract } = useNear();

  const [card, setCard] = useState(null);
  let [loadingState, setLoadingState] = useState(false);
  let [errorFlag, setErrorFlag] = useState(false);
  let [err, setErr] = useState(null);
  //contract is undefined initially
  //need to wait till its defined to call getCard
  //how long to wait?
  let contract: any = null; //workaround to to type errors. not a permanent fix
  useEffect(() => {
    contract = _contract;
    if (contract) {
      getCard();
    }
  }, [_contract]);

  const getCard = async () => {
    console.log(`Attempting to get card for ${owner_id}`);
    try {
      const res = await contract.get_card({ account_id: owner_id });
      if (res) {
        setCard(res);
      }
    } catch (error) {
      setErrorFlag(true);
      setErr(error);
      console.log(error);
    }
  };
  const vouch = async (blockchain) => {
    console.log(`Attempting to vouch for  ${card.owner_id} on ${blockchain}`);
    setLoadingState(true);
    await contract
      .vouch(
        { card_owner_id: card.owner_id, blockchain_name: blockchain },
        BOATLOAD_OF_GAS
      )
      .then(() => setLoadingState(false));
    await getCard();
  };
  const refute = async (blockchain) => {
    console.log(
      `Attempting to refute ${card.owner_id} on ${blockchain} experience.`
    );
    setLoadingState(true);
    await contract
      .refute(
        { card_owner_id: card.owner_id, blockchain_name: blockchain },
        BOATLOAD_OF_GAS
      )
      .then(() => setLoadingState(false));
    await getCard();
  };

  if (loadingState || card === null) {
    return (
      <div className="flex justify-center h-[48px] mt-10 flex-col items-center">
        <BallTriangle
          fill={errorFlag ? "danger" : "near-blue"}
          speed={1.2}
          className=""
        />
        {errorFlag && (
          <ErrorBox
            error={err}
            errorClear={() => {
              setErrorFlag(false);
            }}
          ></ErrorBox>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <section id="business-card" className="mt-10 flex justify-center">
        <UserBusinessCard card={card}></UserBusinessCard>
      </section>
      <section
        id="voting-options"
        className="grid gap-4 
                grid-flow-row  auto-rows-max auto-cols-max
                grid-cols-3
                pt-3 mt-5
                w-900px h-max"
      >
        {Object.keys(card.blockchain_exp).map((key, index) => {
          return (
            <li
              key={`${key}-vote`}
              className="border-4 rounded-md border-black h-[120px] max-w-[235px]  grid-cols-2 flex justify-between"
            >
              <div
                id="experience-container"
                className="flex flex-col
                        w-full border-solid  pr-[10px]"
              >
                <h2
                  id="blockchain-name"
                  className="
                            flex flex-col
                            border-3 border-black border-t-[0px] border-l-[0px]
                            font-mono font-black text-lg font-extrabold
                            self-center
                            h-min w-full"
                >
                  <span className="self-center">{key.toString()}</span>
                </h2>
                <span
                  className=" text-gray-500
                          self-center mt-5"
                >
                  Net Vouches:{" "}
                  <span
                    className="pl-1 pr-2 
                            font-mono font-bold text-xl text-black"
                  >
                    {card.blockchain_exp[key]}
                  </span>
                </span>
              </div>
              <div className="flex-col flex w-min justify-between pr-[10px] py-[10px]">
                <button
                  className={styles.button}
                  onClick={() => vouch(key.toString())}
                >
                  vouch
                </button>
                <button
                  className={styles.button}
                  onClick={() => refute(key.toString())}
                >
                  refute
                </button>
              </div>
            </li>
          );
        })}
      </section>
    </div>
  );
};
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const owner_id = await ctx.query.user;
  console.log(owner_id);
  return {
    props: {
      owner_id: owner_id,
    },
  };
};

export default viewUserPage;
