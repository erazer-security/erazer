import styles from "./Header.module.css";
import { Route, routes } from "./routes";
import { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
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

const pageRoutes: string[] = [
  "Home",
  "Dashboard",
  "Wall of Horror",
  "Private Investigator",
  "Sign In",
  "Sign Out",
];

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
    const response = await fetch(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "http://localhost:5001/checkAuthentication"
        : "https://authentication.erazer.io/checkAuthentication",
      {
        credentials: "include",
      }
    );
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
      <HashLink to="/">
        <img src={logo} className={styles.logo}></img>
      </HashLink>
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
            {routes.map((route: Route, index: number) => {
              if (pageRoutes.includes(route.title)) {
                // if user is not signed in, don't display dashboard
                if (route.title === "Dashboard" && !user) {
                  return null;
                  // if user is signed in, don't display sign in
                } else if (route.title === "Sign In" && user) {
                  return null;
                  // if user is not signed in, don't display sign out
                } else if (route.title === "Sign Out" && !user) {
                  return null;
                } else {
                  return (
                    <MenuItem key={index} bg="#100424">
                      <HashLink smooth to={route.path} className={styles.route}>
                        {route.title}
                      </HashLink>
                    </MenuItem>
                  );
                }
              } else {
                return null;
              }
            })}
          </MenuList>
        </Menu>
      </div>
    </header>
  );
}
