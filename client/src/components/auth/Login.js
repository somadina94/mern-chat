import { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import useInput from "../../hooks/useInput";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import classes from "./Form.module.css";
import { logIn } from "../../api/api";
import { authActions } from "../../store/authSlice";
import Spinner from "../UI/Spinner";
import AuthAlert from "../UI/AuthAlert";

const Login = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertStatus, setAlertStatus] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setCookie = useCookies(["jwt"])[1];
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

  let formIsValid = false;
  if (emailInputIsValid && passwordInputIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowSpinner(true);

    const data = {
      email: emailInput,
      password: passwordInput,
    };

    const res = await logIn(data);

    if (res.status === "success") {
      dispatch(authActions.login({ user: res.data.user }));
      setCookie("jwt", res.token);
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

    emailInputReset();
    passwordInputReset();
  };

  const emailInputClasses = emailInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  const passwordInputClasses = passwordInputIsInvalid
    ? `${classes.group} ${classes.invalid}`
    : classes.group;

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {showSpinner && <Spinner />}
      {showAlert && <AuthAlert message={alertMsg} status={alertStatus} />}
      <h2>Login an account</h2>
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
      <div className={classes.action}>
        <button disabled={!formIsValid}>Login</button>
      </div>
    </form>
  );
};

export default Login;
