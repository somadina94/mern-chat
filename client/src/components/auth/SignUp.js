import { useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import useInput from "../../hooks/useInput";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import classes from "./Form.module.css";
import { createAccount } from "../../api/api";
import { authActions } from "../../store/authSlice";
import Spinner from "../UI/Spinner";
import AuthAlert from "../UI/AuthAlert";

const SignUp = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertStatus, setAlertStatus] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setCookie = useCookies(["jwt"])[1];

  const {
    enteredValue: nameInput,
    enteredValueIsValid: nameInputIsValid,
    enteredValueIsInvalid: nameInputIsInvalid,
    inputChangedHandler: nameInputChangedHandler,
    inputBlurHandler: nameInputBlurHandler,
    inputReset: nameInputReset,
  } = useInput((value) => value.trim() !== "");

  const {
    enteredValue: usernameInput,
    enteredValueIsValid: usernameInputIsValid,
    enteredValueIsInvalid: usernameInputIsInvalid,
    inputChangedHandler: usernameInputChangedHandler,
    inputBlurHandler: usernameInputBlurHandler,
    inputReset: usernameInputReset,
  } = useInput((value) => value.trim() !== "");

  const {
    enteredValue: emailInput,
    enteredValueIsValid: emailInputIsValid,
    enteredValueIsInvalid: emailInputIsInvalid,
    inputChangedHandler: emailInputChangedHandler,
    inputBlurHandler: emailInputBlurHandler,
    inputReset: emailInputReset,
  } = useInput((value) => value.trim().includes("@"));

  const {
    enteredValue: passwordInput,
    enteredValueIsValid: passwordInputIsValid,
    enteredValueIsInvalid: passwordInputIsInvalid,
    inputChangedHandler: passwordInputChangedHandler,
    inputBlurHandler: passwordInputBlurHandler,
    inputReset: passwordInputReset,
  } = useInput((value) => value.trim() !== "");

  const {
    enteredValue: passwordConfirmInput,
    enteredValueIsValid: passwordConfirmInputIsValid,
    enteredValueIsInvalid: passwordConfirmInputIsInvalid,
    inputChangedHandler: passwordConfirmInputChangedHandler,
    inputBlurHandler: passwordConfirmInputBlurHandler,
    inputReset: passwordConfirmInputReset,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;
  if (
    nameInputIsValid &&
    usernameInputIsValid &&
    emailInputIsValid &&
    passwordInputIsValid &&
    passwordConfirmInputIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const data = {
      name: nameInput,
      username: usernameInput,
      email: emailInput,
      password: passwordInput,
      passwordConfirm: passwordConfirmInput,
    };

    const res = await createAccount(data);

    if (res.status === "success") {
      setCookie("jwt", res.token);
      dispatch(authActions.login({ user: res.data.user }));
      setAlertMsg(res.message);
      setAlertStatus(true);
      setShowAlert(true);
      setTimeout(() => {
        navigate("/messages", { replace: true });
      }, 2000);
    } else {
      setAlertMsg(res.message);
      setAlertStatus(false);
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
      setShowSpinner(false);
    }, 2000);

    nameInputReset();
    usernameInputReset();
    emailInputReset();
    passwordInputReset();
    passwordConfirmInputReset();
  };

  const nameInputClasses = nameInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const usernameInputClasses = usernameInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const emailInputClasses = emailInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const passwordInputClasses = passwordInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const passwordConfirmInputClasses = passwordConfirmInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {showSpinner && <Spinner />}
      {showAlert && <AuthAlert message={alertMsg} status={alertStatus} />}
      <h2>Create an account</h2>
      <div className={nameInputClasses}>
        <label>Fullname</label>
        <div className={classes["group-input"]}>
          <IoPersonCircleOutline className={classes.icon} />
          <input
            type="text"
            value={nameInput}
            onChange={nameInputChangedHandler}
            onBlur={nameInputBlurHandler}
          />
        </div>
      </div>
      <div className={usernameInputClasses}>
        <label>Username</label>
        <div className={classes["group-input"]}>
          <IoPersonCircleOutline className={classes.icon} />
          <input
            type="text"
            value={usernameInput}
            onChange={usernameInputChangedHandler}
            onBlur={usernameInputBlurHandler}
          />
        </div>
      </div>
      <div className={emailInputClasses}>
        <label>Email</label>
        <div className={classes["group-input"]}>
          <MdAlternateEmail className={classes.icon} />
          <input
            type="email"
            value={emailInput}
            onChange={emailInputChangedHandler}
            onBlur={emailInputBlurHandler}
          />
        </div>
      </div>
      <div className={passwordInputClasses}>
        <label>Password</label>
        <div className={classes["group-input"]}>
          <RiLockPasswordLine className={classes.icon} />
          <input
            type="password"
            value={passwordInput}
            onChange={passwordInputChangedHandler}
            onBlur={passwordInputBlurHandler}
          />
        </div>
      </div>
      <div className={passwordConfirmInputClasses}>
        <label>Confirm password</label>
        <div className={classes["group-input"]}>
          <RiLockPasswordLine className={classes.icon} />
          <input
            type="password"
            value={passwordConfirmInput}
            onChange={passwordConfirmInputChangedHandler}
            onBlur={passwordConfirmInputBlurHandler}
          />
        </div>
      </div>
      <div className={classes.action}>
        <button disabled={!formIsValid}>Create account</button>
      </div>
    </form>
  );
};

export default SignUp;
