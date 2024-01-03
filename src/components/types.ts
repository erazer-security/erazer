import { Icon } from "@chakra-ui/react";

export type Profile = {
  website: string;
  profile: string;
  age: number;
  locations: string[];
  removalContext: string;
  status?: string;
};

export type Breach = {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  LogoPath: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
};

export type PageRoutes = {
  [key: string]: typeof Icon;
};
