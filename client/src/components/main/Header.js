import classes from "./Header.module.css";
import Nav from "./Nav";

const Header = () => {
  return (
    <header className={classes.header}>
      <p className={classes.logo}>MERN-CHAT-APP</p>
      <Nav />
    </header>
  );
};

export default Header;
