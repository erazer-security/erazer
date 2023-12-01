import { Icon } from "@chakra-ui/react";

export type Profile = {
  website: string;
  profile: string;
  age: number;
  removalContext: string;
  status?: string;
};

export type PageRoutes = {
  [key: string]: typeof Icon;
};
