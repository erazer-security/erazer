import {
  truthRecordSites,
  peoplesWizSites,
  newenglandFactsSites,
  usaOfficialSites,
  floridaResidentsDirectorySites,
  spokeoSites,
  beenVerifiedSites,
  telephonedirectoriesSites,
  checkpeopleSites,
  locatepeopleSites,
  idtrueSites,
} from "@/app/types/Databrokers";
const siteMapping: { [key: string]: string[] } = {
  "truthrecord.org": truthRecordSites,
  "peopleswiz.com": peoplesWizSites,
  "newenglandfacts.com": newenglandFactsSites,
  "usaofficial.info": usaOfficialSites,
  "usa-official.com": usaOfficialSites,
  "floridaresidentsdirectory.com": floridaResidentsDirectorySites,
  "spokeo.com": spokeoSites,
  "beenverified.com": beenVerifiedSites,
  "telephonedirectories.us": telephonedirectoriesSites,
  "checkpeople.com": checkpeopleSites,
  "locatepeople.org": locatepeopleSites,
  "idtrue.com": idtrueSites,
};
import { Profile } from "@/app/types/Profile";

/**
 * This function takes a list of profiles and returns an expanded list of profiles according to the siteMapping
 */
export default function getAllProfiles(profiles: Profile[]) {
  const allProfiles: Profile[] = [];
  profiles.forEach((profile: Profile) => {
    allProfiles.push(profile);

    // find the sites that match the profile.website, and add them to the list of profiles
    if (siteMapping[profile.website]) {
      siteMapping[profile.website].forEach((site: string) => {
        allProfiles.push({
          ...profile,
          website: site,
        });
      });
    }
  });
  return allProfiles;
}
