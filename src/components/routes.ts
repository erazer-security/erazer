export interface Route {
  path: string;
  title: string;
}

export const routes: Route[] = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/dashboard",
    title: "Dashboard",
  },
  {
    path: "/#hallOfHorror",
    title: "Hall of Horror",
  },
  {
    path: "/feedback",
    title: "Feedback",
  },
  {
    path: "/signin",
    title: "Sign In",
  },
  {
    path:
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "http://localhost:5001/logout"
        : "https://authentication.erazer.io/logout",
    title: "Sign Out",
  },
];
