import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useNear } from "../../context/NearProvider";
import { BallTriangle } from "react-loading-icons";
import { useEffect } from "react";
import { Contract } from "near-api-js";
import { UserBusinessCard } from "../../components/UserBusinessCard";
import { Big } from "big.js";
import ErrorBox from "../../components/ErrorBox";
import { useErrors } from "../../context/TransactionProvider";
import { useNavContext } from "../../components/Nav";
import {
  useTxnState,
  useContractMethod,
} from "../../context/TransactionProvider";

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
  let { owner_id } = props;
  let { wallet } = useNear();
  let { loading, data, error } = useTxnState();
  let { viewFunction, callFunction } = useContractMethod();
  let { errorList } = useErrors();
  let { setShowSearchBox } = useNavContext();
  const [userNotFound, setUserNotFound] = useState(false);

  const [card, setCard] = useState(null);
  // useEffect(() => {
  //   data ? setCard(data) : setCard(null);
  // }, [data]);
  useEffect(() => {
    if (wallet) {
      getCard();
    }
  }, [owner_id, wallet]);

  const getCard = async () => {
    console.log(`Attempting to get card for ${owner_id}`);
    let res = await viewFunction("get_card", { account_id: String(owner_id) });
    if (res) {
      setShowSearchBox(false);
      setCard(res);
    } else {
      setCard(null);
      setUserNotFound(true);
    }
  };
  const vouch = async (blockchain) => {
    console.log(`Attempting to vouch for  ${card.owner_id} on ${blockchain}`);
    await callFunction("vouch", {
      card_owner_id: card.owner_id,
      blockchain_name: blockchain,
    });
    await getCard();
  };
  const refute = async (blockchain) => {
    console.log(
      `Attempting to refute ${card.owner_id} on ${blockchain} experience.`
    );
    await callFunction("refute", {
      card_owner_id: card.owner_id,
      blockchain_name: blockchain,
    });
    await getCard();
  };

  if (card === null) {
    return (
      <>
        <div className="flex justify-center h-[48px] mt-10 flex-col items-center">
          <BallTriangle
            speed={!loading ? 0 : 1.2}
            fill={error ? "danger" : "near-blue"}
            className=""
          />
        </div>
        {userNotFound && !loading && (
          <h1
            className="flex justify-center text-[30px] font-mono
           w-full mt-[15px]"
          >
            No User Found
          </h1>
        )}
      </>
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
  return {
    props: {
      owner_id: owner_id,
    },
  };
};

export default viewUserPage;
