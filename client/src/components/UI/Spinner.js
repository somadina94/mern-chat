import classes from "./Spinner.module.css";

import { Spinner as Spin } from "react-bootstrap";

const Spinner = () => {
  return (
    <div className={classes.backdrop}>
      <Spin
        animation="border"
        size="lg"
        variant="primary"
        style={{ width: "3rem", height: "3rem" }}
        className={classes.spinner}
      />
    </div>
  );
};

export default Spinner;
