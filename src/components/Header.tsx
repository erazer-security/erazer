import styles from "./Header.module.css";
import { Route, routes } from "./routes";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import logo from "/logo.png";

function Header() {
  var menuStyles = {
    bmBurgerButton: {
      position: "relative",
      width: "26px",
      height: "20px",
    },
    bmBurgerBars: {
      background: "#6736f5",
    },
    bmCrossButton: {
      height: "24px",
      width: "24px",
    },
    bmCross: {
      background: "#bdc3c7",
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
    },
    bmMenu: {
      background: "#100424",
      padding: "2.5em 1.5em 0",
      fontSize: "16px",
      fontFamily: "Poppins, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: "600",
    },
    bmItemList: {
      display: "flex",
      flexDirection: "column",
      color: "white",
      padding: "0.8em",
    },
    bmItem: {
      display: "inline-block",
      marginBottom: "7px",
    },
    bmOverlay: {
      background: "#100424",
    },
  };
  return (
    <div className={styles.banner}>
      <Link to="/">
        <img src={logo} className={styles.logo}></img>
      </Link>
      <div className={styles.routes}>
        {routes.map((route: Route, index: number) => (
          <Link key={index} to={route.path} className={styles.route}>
            {route.title}
          </Link>
        ))}
      </div>
      <div className={styles.hamburgerMenu}>
        <Menu right styles={menuStyles}>
          {routes.map((route: Route, index: number) => (
            <Link key={index} to={route.path} className={styles.route}>
              {route.title}
            </Link>
          ))}
        </Menu>
      </div>
    </div>
  );
}

export default Header;
