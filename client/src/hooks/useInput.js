import { useState } from "react";

const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const enteredValueIsValid = validateValue(enteredValue);
  const enteredValueIsInvalid = !enteredValueIsValid && isTouched;

  const inputChangedHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const inputReset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    enteredValue,
    enteredValueIsValid,
    enteredValueIsInvalid,
    inputChangedHandler,
    inputBlurHandler,
    inputReset,
  };
};

export default useInput;
