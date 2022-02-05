import React from "react";
type ComponentProps = {
  card: {
    blockchain_exp: {};
    owner_id: string;
    website_url: string;
  };
};
export const UserBusinessCard = (props: ComponentProps) => {
  let { card } = props;
  return (
    <>
      <div
        id="card-container"
        className=" rounded-lg 
            bg-warm-gray-100
            px-[30px] pt-[10px] pb-[5px]
            w-[500px] h-[260px]
            grid grid-rows-8"
      >
        <h1
          id="account-name"
          className="text-xl font-semibold h-min
          items-start flex-col flex
          pl-[1rem] mr-[4rem] 
          border-black border-b-2 "
        >
          <p className="w-min">{card.owner_id}</p>
        </h1>
        <span
          id="user-info"
          className="self-start h-full row-span-5 pt-[2rem] "
        >
          {card.website_url ? (
            <>
              Web:{" "}
              <a
                target="_blank"
                href={card.website_url}
                className="hover:(underline text-near-blue) text-gray-600"
              >
                {card.website_url}
              </a>
            </>
          ) : (
            <span className="text-gray-900">No Website</span>
          )}
        </span>
        <section
          id="bockchain-exp"
          className=" h-full row-span-2
          flex-row flex self-end flex-wrap "
        >
          {card.blockchain_exp &&
            Object.keys(card.blockchain_exp).map((key, index) => {
              return (
                <div
                  key={key}
                  id="experience-container"
                  className="h-max w-min "
                >
                  {card.blockchain_exp[key] ? (
                    <>
                      <span
                        id="blockchain-name"
                        className="font-normal bold text-sm"
                      >
                        <span>{key.toString()}:</span>
                      </span>
                      <span
                        className="pl-1 pr-2 
                              font-mono  font-semibold text-gray-900"
                      >
                        {card.blockchain_exp[key]}
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
        </section>
      </div>
    </>
  );
};
