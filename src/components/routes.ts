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
    path: "/privateInvestigator",
    title: "Private Investigator",
  },
  {
    path: "/wallofhorror",
    title: "Wall of Horror",
  },
  {
    path: "/feedback",
    title: "Feedback",
  },
  {
    path:
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "http://localhost:5001/logout"
        : "https://authentication.erazer.io/logout",
    title: "Sign Out",
  },
];
