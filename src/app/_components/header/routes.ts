export interface Route {
  path: string;
  title: string;
}

export const routes: Array<Route> = [
  {
    path: "/#process",
    title: "Process",
  },
  {
    path: "/#testimonials",
    title: "Testimonials",
  },
  {
    path: "/#roadmap",
    title: "Roadmap",
  },
  {
    path: "/#pricing",
    title: "Pricing",
  },
  {
    path: "/dashboard",
    title: "Dashboard",
  },
  {
    path: "/#wall-of-horror",
    title: "Wall of Horror",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
  },
  {
    path:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5001/auth/google"
        : "https://authentication.erazer.io/auth/google",
    title: "Sign In",
  },
  {
    path:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5001/logout"
        : "https://authentication.erazer.io/logout",
    title: "Sign Out",
  },
];
