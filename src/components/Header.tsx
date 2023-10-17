import styles from "./Header.module.css";
import { useEffect, useState } from "react";
import { Route, routes } from "./routes";
import logo from "/logo.png";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";

function Header() {
  const [atTop, setAtTop] = useState(true);

  // Check if page is at top to update the background color
  useEffect(() => {
    if (typeof window != "undefined") {
      window.addEventListener("scroll", () => {
        // A bit hacky way to make sure the component doesn't re-render every single scroll event
        if (Math.round(window.scrollY) != 0 && atTop) {
          setAtTop(false);
          return;
        } else if (Math.round(window.scrollY) == 0) {
          setAtTop(true);
          return;
        }
      });
    }
  }, []);

  return (
    <div className={`${styles.banner} ${!atTop ? styles.bannerScrolled : ""}`}>
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
        <Menu right>
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
