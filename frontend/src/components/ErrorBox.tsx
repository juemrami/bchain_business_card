import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
type ErrorProps = {
  error: Error;
  errorClear: any;
};
const ErrorBox = (props: ErrorProps) => {
  let { error, errorClear } = props;
  const router = useRouter();
  let message = error?.message;
  console.log(message);
  //error message returned contains some leading info before it gives the json parseable error
  //need to clean-up the returned error with some regex to extract the JSON info and use it
  //to display error to user.

  //return if not a smart contract related error
  if (!message?.search("wasm execution failed") || !message) {
    return <></>;
  }
  const parseError = (str) => {
    let pattern = /panicked at .*.'/;
    let exracted = pattern.exec(str);
    let res = exracted[0];
    res = res.replace(`"`, "");
    return res;
  };
  message = parseError(message);
  return (
    <div
      id="error-box"
      className="flex flex-col shadow-xl rounded-xl px-[15px] mt-10 bg-warm-gray-200 w-max"
    >
      <span
        className="text-sm self-end pt-[2px] hover:(underline cursor-pointer)"
        onClick={() => {
          errorClear();
        }}
      >
        <Link href="/">close</Link>
      </span>
      <h1 className="text-xl font-mono font-semibold self-center">
        Error with the Smart Contract:
      </h1>
      <div className="font-sans text-lg text-dark-200">
        Info
        <p className="text-danger text-md font-mono w-[400px] mt-[-5px]">
          {message || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ErrorBox;
