import "./Header.css";
import logo from "/logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="banner">
        <img src={logo} className="logo"></img>
        <div className="routes">
          <Link to="/" className="route">
            Home
          </Link>
          <Link to="/product" className="route">
            Product
          </Link>
          <Link to="/resources" className="route">
            Resources
          </Link>
          <Link to="/feedback" className="route">
            Feedback
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;
