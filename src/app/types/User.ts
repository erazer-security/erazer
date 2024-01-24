import { Profile } from "@/app/types/Profile";
import { Breach } from "@/app/types/Breach";

export type User = {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  state: string;
  age: number;
  email: string;
  picture: string;
  scannedProfiles: Profile[];
  removedProfiles: Profile[];
  breaches: Breach[];
  paidForRemoval: boolean;
  paidForMonthlyRemoval: boolean;
  lastRemovalDate: Date;
  syncedRemovals: boolean;
};
