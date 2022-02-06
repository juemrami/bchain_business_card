import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Interface } from "readline";
type ErrorProps = {
  errorList: Error[];
};
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

const ErrorBox = (props: ErrorProps) => {
  console.log("in error box");
  let { errorList: errorProps } = props;
  const [errorList, setErrorList] = useState<parsedError[]>();

  useEffect(() => {
    //Take passed Errors from props
    //extract important bits for displaying
    //push to parsedErrors Array
    //save to state
    let parsedErrors: parsedError[] = [];
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
    setErrorList(parsedErrors);
  }, [errorProps]);

  //remove selected error from the list of errors
  //this should force a state update from the useEffect
  //above
  const clearError = (index: number) => {
    console.log("Removing Error");
    // console.log(errorList);
    // console.log(errorList.splice(index, 1));
    setErrorList((prev) => prev.splice(index, 1));
  };

  console.log(errorList);
  if (errorList?.length == 0) {
    console.log("nothing to render");
    return <></>;
  }

  return (
    <>
      {errorList?.length > 0 &&
        errorList.map(({ errorMessage, isContractError, error }, index) => (
          <div
            key={`error-box-${index}`}
            className="flex flex-col shadow-xl rounded-xl px-[15px] mt-1 bg-warm-gray-200 w-max"
          >
            <span
              className="text-sm self-end pt-[2px] hover:(underline cursor-pointer)"
              onClick={() => {
                clearError(index);
              }}
            >
              <p>close</p>
            </span>
            <h1 className="text-xl font-mono font-semibold self-center">
              {isContractError ? (
                <>Smart Contract exectuion Error:</>
              ) : (
                <>Smart Contract related Error:</>
              )}
            </h1>
            <div className="">
              <span className="font-sans text-sm  text-gray-500">Info:</span>
              <p className="text-danger text-lg no-underline font-mono w-[400px] mt-[-5px]">
                {errorMessage || "N/A"}
              </p>
            </div>
          </div>
        ))}
    </>
  );
};

export default ErrorBox;
