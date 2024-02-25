import { databrokers } from "@/app/types/Databrokers";
import { Profile } from "@/app/types/Profile";

/**
 * This function takes a list of profiles and returns an expanded list of profiles according to the siteMapping
 */
export default function getAllProfiles(profiles: Profile[]) {
  const allProfiles: Profile[] = [];
  profiles.forEach((profile: Profile) => {
    // find the sites that match the profile.website, and add them to the list of profiles
    databrokers[profile.website].forEach((site: string) => {
      allProfiles.push({
        ...profile,
        website: site,
      });
    });
  });
  return allProfiles;
}
