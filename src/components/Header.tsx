import "./Header.css";
import { Route, routes } from "./routes";
import logo from "/logo.png";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";

function Header() {
  return (
    <>
      <div className="banner">
        <a href="/">
          <img src={logo} className="logo"></img>
        </a>
        <div className="routes">
          {routes.map((route: Route, index: number) => (
            <Link key={index} to={route.path} className="route">
              {route.title}
            </Link>
          ))}
        </div>
        <div className="hamburgerMenu">
          <Menu right>
            {routes.map((route: Route, index: number) => (
              <Link key={index} to={route.path} className="route">
                {route.title}
              </Link>
            ))}
          </Menu>
        </div>
      </div>
    </>
  );
}

export default Header;
