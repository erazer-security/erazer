import "./Banner.css";
import logo from "/logo.png";

function Banner() {
  return (
    <>
      <div className="banner">
        <img src={logo} className="logo"></img>
        <div className="routes">
          <a href="/" className="route">
            Home
          </a>
          <a href="/resources" className="route">
            Resources
          </a>
        </div>
      </div>
    </>
  );
}

export default Banner;
