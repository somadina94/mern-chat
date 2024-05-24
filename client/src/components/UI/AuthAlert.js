import ReactDOM from "react-dom";
import { Fragment } from "react";
import classes from "./AuthAlert.module.css";

const Overlay = (props) => {
  const { message, status } = props;

  const alertClasses = status
    ? `${classes.alert} ${classes.success}`
    : `${classes.alert} ${classes.error}`;

  return <p className={alertClasses}>{message}</p>;
};

const AuthAlert = (props) => {
  const overlayRoot = document.getElementById("overlay-root");
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Overlay message={props.message} status={props.status} />,
        overlayRoot
      )}
    </Fragment>
  );
};

export default AuthAlert;
