import styles from "./Header.module.css";
// import { Route, routes } from "./routes";
import { Link } from "react-router-dom";
// import {
//   IconButton,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
// } from "@chakra-ui/react";
// import { HamburgerIcon } from "@chakra-ui/icons";
import logo from "/logo.png";

function Header() {
  return (
    <div className={styles.banner}>
      <Link to="/">
        <img src={logo} className={styles.logo}></img>
      </Link>
      {/* <div className={styles.routes}>
        {routes.map((route: Route, index: number) => (
          <Link key={index} to={route.path} className={styles.route}>
            {route.title}
          </Link>
        ))}
      </div>
      <div className={styles.hamburgerMenu}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Menu Options"
            icon={<HamburgerIcon boxSize="30px" color="#6736f5" />}
            variant="unstyled"
          />
          <MenuList bg="#100424">
            {routes.map((route: Route, index: number) => (
              <MenuItem key={index} bg="#100424">
                <Link to={route.path} className={styles.route}>
                  {route.title}
                </Link>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div> */}
    </div>
  );
}

export default Header;
