import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // fetch("http://localhost:5001/checkAuthentication", {
    fetch("https://auth.erazer.io/checkAuthentication", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
        setIsLoading(false);
      });
  }, []);

  return isLoading ? null : isAuthenticated ? (
    children
  ) : (
    <Navigate to="/signin" />
  );
}
