import { Profile } from "@/app/types/Profile";
import { Breach } from "@/app/types/Breach";

export type User = {
  id: string;
  created_at: Date;
  name: string;
  firstName: string;
  lastName: string;
  state: string;
  age: number;
  phoneNumber: number;
  email: string;
  picture: string;
  scannedProfiles: Profile[];
  removedProfiles: Profile[];
  monthlyScannedProfiles: Profile[];
  breaches: Breach[];
  paidForRemoval: boolean;
  paidForMonthlyRemoval: boolean;
  lastRemovalDate: Date;
  syncedRemovals: boolean;
};
