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
  console.log(props);
  return (
    <>
      <div
        id="card-container"
        className="border-2 border-black rounded-lg 
            bg-yellow-100
            px-[10px] pt-[10px]
            w-[500px] h-[260px]"
      >
        <h1
          id="account-name"
          className="text-xl font-semibold 
          justify-content-center flex
          border-1 border-red-600"
        >
          <p>{card.owner_id}</p>
        </h1>
        <span className="border-2 border-green-600 ">
          {card.website_url ? `Website: ${card.website_url}` : "No Website"}
        </span>
      </div>
      {JSON.stringify(card)}
    </>
  );
};
