import styles from "./Header.module.css";
import { Route, routes } from "./routes";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import logo from "/logo.png";

export default function Header() {
  // handle header scroll color change
  const [isScrolled, setIsScrolled] = useState(false);
  const checkScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const getUser = async () => {
    // const response = await fetch("http://localhost:5001/checkAuthentication", {
    const response = await fetch("https://auth.erazer.io/checkAuthentication", {
      credentials: "include",
    });
    const data = await response.json();
    console.log("data", data);
    return data.authenticated ? data.user : null;
  };

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return (
    <header
      className={
        isScrolled ? `${styles.banner} ${styles.sticky}` : `${styles.banner}`
      }
    >
      <Link to="/">
        <img src={logo} className={styles.logo}></img>
      </Link>
      <div className={styles.hamburgerMenu}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Menu Options"
            icon={
              user ? ( // if user is signed in, display profile picture
                <img src={user.picture} className={styles.profilePicture}></img>
              ) : (
                <HamburgerIcon boxSize="30px" color="#6736f5" />
              )
            }
            variant="unstyled"
          />
          <MenuList bg="#100424">
            {(user ? routes : routes.slice(0, -1)).map(
              // if the user isn't signed in, don't show sign out route
              (route: Route, index: number) => (
                <MenuItem key={index} bg="#100424">
                  <Link to={route.path} className={styles.route}>
                    {route.title}
                  </Link>
                </MenuItem>
              )
            )}
          </MenuList>
        </Menu>
      </div>
    </header>
  );
}
