"use client";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  const getUser = async () => {
    const response = await fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:5001/checkAuthentication"
        : "https://authentication.erazer.io/checkAuthentication",
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    // console.log("useUser just got user", data);
    return data.authenticated ? data.user : null;
  };

  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
}
