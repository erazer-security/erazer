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
];
