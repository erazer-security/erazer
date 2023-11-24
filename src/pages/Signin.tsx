import styles from "./Signin.module.css";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import googleLogo from "/googleLogo.png";
import loginLaptop from "/loginLaptop.png";

export default function Signin() {
  const getUser = async () => {
    // const response = await fetch("http://localhost:5001/checkAuthentication", {
    const response = await fetch("https://auth.erazer.io/checkAuthentication", {
      credentials: "include",
    });
    const data = await response.json();
    return data.authenticated ? data.user : null;
  };

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return (
    <>
      {user ? (
        <Navigate to="/dashboard" />
      ) : (
        <div className={styles.loginContainer}>
          <h1 className={styles.loginHeading}>
            Welcome to <span className={styles.secondHeadingColor}>Erazer</span>
            , please sign in!
          </h1>
          <h3 className={styles.loginSecondHeading}>
            Start protecting yourself today, try{" "}
            <span className={styles.secondHeadingColor}>Erazer</span> <br />
            and always be at a peace of mind.
          </h3>
          <Link
            // to="http://localhost:5001/auth/google"
            to="https://auth.erazer.io/auth/google"
            className={styles.loginGoogleButton}
          >
            <img src={googleLogo} className={styles.googleLogo}></img>
            SIGN IN WITH GOOGLE
          </Link>
          <img src={loginLaptop} className={styles.loginLaptop}></img>
        </div>
      )}
    </>
  );
}
