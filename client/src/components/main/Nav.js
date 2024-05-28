import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import classes from "./Nav.module.css";
import { authActions } from "../../store/authSlice";
import { logOut } from "../../api/api";
import AuthAlert from "../UI/AuthAlert";

const Nav = () => {
  const [alertMsg, setAlertMsg] = useState("");
  const [alertStatus, setAlertStatus] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const setCookie = useCookies(["jwt"])[1];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const logoutHandler = async (e) => {
    e.preventDefault();
    const res = await logOut();
    if (res.status === "success") {
      setCookie("jwt", res.token);
      dispatch(authActions.logout());
      setAlertMsg(res.message);
      setAlertStatus(true);
      setShowAlert(true);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } else {
      setAlertMsg(res.message);
      setAlertStatus(false);
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 1500);
  };
  return (
    <nav className={classes.nav}>
      {showAlert && <AuthAlert message={alertMsg} status={alertStatus} />}
      {isLoggedIn && (
        <NavLink
          to="/messages"
          className={(navData) => (navData.isActive ? classes.active : "")}
        >
          Messages
        </NavLink>
      )}
      {!isLoggedIn && (
        <NavLink
          to="/signup"
          className={(navData) => (navData.isActive ? classes.active : "")}
        >
          Sign up
        </NavLink>
      )}
      {!isLoggedIn && (
        <NavLink
          to="/login"
          className={(navData) => (navData.isActive ? classes.active : "")}
        >
          Login
        </NavLink>
      )}
      {isLoggedIn && (
        <NavLink to="#" onClick={logoutHandler}>
          Log out
        </NavLink>
      )}
    </nav>
  );
};

export default Nav;
