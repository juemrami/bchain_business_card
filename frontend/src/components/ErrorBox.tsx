import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Interface } from "readline";
import { useErrors } from "../context/TransactionProvider";

type parsedError = {
  errorMessage: String;
  isContractError: Boolean;

  error: Error;
};

const parseContractErrorString = (str) => {
  let pattern = /panicked at .*.'/;
  let exracted = pattern.exec(str);
  let res = exracted[0];
  res = res.replace(`"`, "");
  return res;
};

const ErrorBox = () => {
  console.log("in error box");
  let { errorList: errorProps } = useErrors();
  const [errorList, setErrorList] = useState<parsedError[]>();
  const { clearError } = useErrors();
  // if (!errorProps) return <></>;
  useEffect(() => {
    //Take passed Errors from props
    //extract important bits for displaying
    //push to parsedErrors Array
    //save to state

    let parsedErrors: parsedError[] = [];
    if (errorProps?.length > 0) {
      errorProps.map((error) => {
        let message = error.message;
        let contractError = false;
        // console.log(error);
        if (message?.search("wasm execution failed") <= 0 || !message) {
          console.log("Non Smart Contract error passed to ErrorBox");
        } else {
          contractError = true;
          message = parseContractErrorString(message);
        }
        let parsedError: parsedError = {
          errorMessage: message,
          isContractError: contractError,
          error: error,
        };

        parsedErrors.push(parsedError);
      });
    }
    setErrorList(parsedErrors);
  }, [errorProps]);

  //remove selected error from the list of errors
  //this should force a state update from the useEffect
  //above

  console.log(errorList);
  if (errorList?.length == 0) {
    console.log("nothing to render");
    return <></>;
  }

  return (
    <>
      <div
        className="text-xs text-danger 
        border-danger border-1 rounded-sm 
        absolute ml-[15px] mt-[-20px] px-[2px]
        hover:cursor-pointer"
        onClick={() => {clearError(null, true)}}
      >
        close all
      </div>
      {errorList?.length > 0 &&
        errorList.map(({ errorMessage, isContractError, error }, index) => (
          <div
            key={`error-box-${index}`}
            className="flex flex-col 
            shadow-xl rounded-xl 
            px-[15px] mb-1 
            bg-warm-gray-200 
            max-w-min h-min"
          >
            <span
              className="text-sm self-end pt-[2px] hover:(underline cursor-pointer)"
              onClick={() => {
                clearError(index);
              }}
            >
              <p>close</p>
            </span>
            <h1
              className="text-md font-mono  
              w-max font-semibold 
              self-center
              mx-[35px]
              mt-[-9px]"
            >
              {isContractError ? (
                <>Smart Contract exectuion Error:</>
              ) : (
                <>Smart Contract related Error:</>
              )}
            </h1>
            <div className="">
              <span className="font-sans text-sm text-gray-500">Info:</span>
              <p
                className="text-danger text-md no-underline font-mono 
              w-[full] 
              mt-[-5px] mb-[1px]"
              >
                {errorMessage || "N/A"}
              </p>
            </div>
          </div>
        ))}
    </>
  );
};

export default ErrorBox;
