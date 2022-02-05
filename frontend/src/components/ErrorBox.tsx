import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Interface } from "readline";
type ErrorProps = {
  errorList: Error[];
};
const parseContractErrorString = (str) => {
  let pattern = /panicked at .*.'/;
  let exracted = pattern.exec(str);
  let res = exracted[0];
  res = res.replace(`"`, "");
  return res;
};

const ErrorBox = (props: ErrorProps) => {
  console.log("in error box");
  let { errorList: passedErrors } = props;
  type parsedError = {
    errorMessage: String;
    isContractError: Boolean;
  };
  const [errorList, setErrorList] = useState<parsedError[]>(undefined);

  const router = useRouter();

  passedErrors.map((error) => {
    let message = error.message;
    let contractError = false;
    console.log(message);
    if (message?.search("wasm execution failed") <= 0 || !message) {
      console.log("Non Smart Contract error passed to ErrorBox");
    } else {
      contractError = true;
      message = parseContractErrorString(message);
    }
    let parsedError: parsedError = {
      errorMessage: message,
      isContractError: contractError,
    };

    setErrorList((prev) => [...prev, parsedError]);
  });

  console.log(errorList);

  return (
    <div
      id="error-box"
      className="flex flex-col shadow-xl rounded-xl px-[15px] mt-10 bg-warm-gray-200 w-max"
    >
      <span
        className="text-sm self-end pt-[2px] hover:(underline cursor-pointer)"
        onClick={() => {
          errorClear(error);
        }}
      >
        <Link href="/">close</Link>
      </span>
      <h1 className="text-xl font-mono font-semibold self-center">
        {contractError ? (
          <>Smart Contract exectuion Error:</>
        ) : (
          <>Smart Contract related Error:</>
        )}
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
