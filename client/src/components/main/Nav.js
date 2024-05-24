import { NavLink } from "react-router-dom";

import classes from "./Nav.module.css";

const Nav = () => {
  return (
    <nav className={classes.nav}>
      <NavLink
        to="/messages"
        className={(navData) => (navData.isActive ? classes.active : "")}
      >
        Messages
      </NavLink>
      <NavLink
        to="/signup"
        className={(navData) => (navData.isActive ? classes.active : "")}
      >
        Sign up
      </NavLink>
      <NavLink
        to="/login"
        className={(navData) => (navData.isActive ? classes.active : "")}
      >
        Login
      </NavLink>
      <NavLink
        to="/logout"
        className={(navData) => (navData.isActive ? classes.active : "")}
      >
        Log out
      </NavLink>
    </nav>
  );
};

export default Nav;
