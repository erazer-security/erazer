import "./Header.css";
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
          <Link to="/" className="route">
            Home
          </Link>
          <Link to="/product" className="route">
            Product
          </Link>
          <Link to="/wallofhorror" className="route">
            Wall of Horror
          </Link>
          <Link to="/feedback" className="route">
            Feedback
          </Link>
        </div>
        <div className="hamburgerMenu">
          <Menu right>
            <Link to="/" className="route">
              Home
            </Link>
            <Link to="/product" className="route">
              Product
            </Link>
            <Link to="/wallofhorror" className="route">
              Wall of Horror
            </Link>
            <Link to="/feedback" className="route">
              Feedback
            </Link>
          </Menu>
        </div>
      </div>
    </>
  );
}

export default Header;
