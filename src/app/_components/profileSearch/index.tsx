"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SearchBar from "@/app/_components/searchBar";
import { Progress } from "@/components/ui/progress";
import Globe from "@/app/_components/globe";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Profile } from "@/app/types/Profile";
import { allDatabrokers } from "@/app/types/Databrokers";
import TooManyProfiles from "./tooManyProfiles";
import ProfilesCarousel from "./profilesCarousel";

export default function ProfileSearch() {
  const router = useRouter();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userState, setUserState] = useState<string>("");
  const [userCity, setUserCity] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [locations, setLocations] = useState<string[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [tooManyProfiles, setTooManyProfiles] = useState<boolean>(false);
  const [showSuggestedLocations, setShowSuggestedLocations] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentDatabroker, setCurrentDatabroker] = useState<string>(
    allDatabrokers[0]
  );
  const [removalReady, setRemovalReady] = useState<boolean>(false);

  async function searchProfile() {
    // ensure first and last name and age are not empty
    if (firstName.trim() === "" || lastName.trim() === "") {
      toast({
        variant: "destructive",
        description: "Please enter your first and last name",
      });
      return;
    }
    if (age === 0) {
      toast({
        variant: "destructive",
        description: "Please enter your age",
      });
      return;
    }
    if (userState === "") {
      toast({
        variant: "destructive",
        description: "Please enter your state",
      });
      return;
    }

    setUserCity("");
    setLocations([]);
    setFilteredProfiles([]);
    setSelectedProfiles([]);
    setLoading(true);
    setRemovalReady(false);
    setOpenDialog(true);
    setHeading(
      `Hi ${firstName}, we’re currently searching for your profile across the web...`
    );

    // Track when fetch request is completed to update progress bar
    let isFetchCompleted: boolean = false;
    // Fetch the profile, if it exists, from the server
    const fetchProfilesPromise = fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:5002/profiles"
        : "https://api.erazer.io/profiles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          userState,
          age,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        isFetchCompleted = true; // all fetch requests are completed
        if (data.profiles.length === 0) {
          return;
        } else {
          const profilesFiltered = data.profiles.filter(
            (profile: Profile) => profile.age == age || profile.age == 0 // get profiles with matching ages or no ages shown (could be user)
          );
          if (profilesFiltered.length === 0) {
          } else {
            setFilteredProfiles(profilesFiltered);
            updateLocations(profilesFiltered);

            if (profilesFiltered.length === 1) {
              setHeading("We found 1 profile.");
              setRemovalReady(true); // since this is the only profile available, enable removal button
            } else {
              setHeading(`We found ${profilesFiltered.length} profiles.`);
              if (profilesFiltered.length > 10) {
                setTooManyProfiles(true);
              }
            }
          }
        }
      })
      .catch((error) => console.error("Error:", error));

    // update progress bar
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const updateProgressBarPromise = (async () => {
      const totalDelayTime = 40000; // 40 seconds
      const delayTime = totalDelayTime / allDatabrokers.length;
      for (let i = 0; i < allDatabrokers.length; i++) {
        if (isFetchCompleted) {
          break;
        }
        await delay(delayTime);
        setProgress(((i + 1) / allDatabrokers.length) * 97); // set max progress to 97%
        setCurrentDatabroker(`${allDatabrokers[i]}`);
      }
    })();

    await Promise.all([fetchProfilesPromise, updateProgressBarPromise]);
    setLoading(false);
    setProgress(0); // reset progress bar
    setCurrentDatabroker(allDatabrokers[0]);
  }

  function updateLocations(profiles: Profile[]) {
    // setLocations to profiles's locations. Use Set to remove duplicates
    setLocations(
      Array.from(
        new Set(
          profiles
            .map((profile: Profile) =>
              profile.locations.map((location: string) =>
                location.toUpperCase()
              )
            )
            .flat()
        )
      )
    );
  }

  async function narrowProfiles() {
    if (userCity.trim() === "") {
      toast({
        variant: "destructive",
        description: "Please enter a city",
      });
      return;
    }

    // only keep profiles that include the user's city
    const profilesFiltered = filteredProfiles.filter((profile: Profile) =>
      // check if any of the profile's locations include the user's city
      // if the profile.website is usa-official.com, then check if the profile.profile includes the user's city (this is because usa-official.com have very non static ways of displaying locations)
      profile.website === "usa-official.com"
        ? profile.profile.toUpperCase().includes(userCity)
        : profile.locations.some((location: string) =>
            location.toUpperCase().includes(userCity)
          )
    );

    setFilteredProfiles(profilesFiltered);
    updateLocations(profilesFiltered);

    if (profilesFiltered.length === 0) {
      setHeading("It looks like your city doesn't match any of the profiles.");
      return;
    } else {
      setHeading("These are the profiles that match your city.");
      if (profilesFiltered.length === 1) {
        setRemovalReady(true); // since this is the only profile available, enable removal button
      }
    }
  }

  function handleProfileAdd(profile: Profile) {
    // add profile to selected profiles if it doesn't already exist
    if (!selectedProfiles.includes(profile)) {
      setSelectedProfiles([...selectedProfiles, profile]);
    }
  }

  function handleProfileRemove(profile: Profile) {
    // remove profile from selected profiles
    setSelectedProfiles(
      selectedProfiles.filter((selectedProfile) => selectedProfile != profile)
    );
  }

  function navigateResults() {
    // ensure at least one profile is selected
    if (selectedProfiles.length === 0) {
      setHeading("You must select at least one profile to begin removal.");
      return;
    }

    // for all selected profiles, add a field to the object called "status" and set it to "Pending"
    const selectedProfilesWithStatus = selectedProfiles.map(
      (profile: Profile) => ({
        ...profile,
        status: "Pending",
      })
    );

    setRemovalReady(false); // disable removal button

    // set necessary removal information in session and navigate to sign in page
    sessionStorage.setItem("firstName", firstName);
    sessionStorage.setItem("lastName", lastName);
    sessionStorage.setItem("userState", userState);
    sessionStorage.setItem("age", age.toString());
    sessionStorage.setItem(
      "selectedProfiles",
      JSON.stringify(selectedProfilesWithStatus)
    );

    router.push(
      process.env.NODE_ENV === "development"
        ? "http://localhost:5001/auth/google"
        : "https://authentication.erazer.io/auth/google"
    );
  }

  return (
    <div>
      <SearchBar
        setFirstName={setFirstName}
        setLastName={setLastName}
        setAge={setAge}
        setUserState={setUserState}
        searchProfile={searchProfile}
      />
      <Dialog open={openDialog}>
        {loading ? (
          <DialogContent className="justify-center px-20 py-14 outline-none">
            <DialogHeader className="gap-5">
              <DialogTitle className="text-center">{heading}</DialogTitle>
              <Progress value={progress} className="h-[3px]" />
            </DialogHeader>
            <Globe />
            <p className="text-center text-sm font-medium leading-[15.4px] tracking-[-0.7px]">
              {currentDatabroker}
            </p>
          </DialogContent>
        ) : (
          <DialogContent className="p-10 lg:px-20 lg:py-14">
            <DialogHeader>
              <div className="w-full flex flex-col gap-4 lg:gap-5">
                <div className="w-full flex flex-row">
                  <h4 className="sm:w-[181px] md:w-full text-[28px] text-left font-bold leading-[40px] mr-auto">
                    {heading}
                  </h4>
                  <button
                    onClick={() => setOpenDialog(false)}
                    className="h-fit bg-white text-black text-sm font-medium ml-auto rounded-full py-[10px] px-[18px] transition-colors duration-100 ease-in-out hover:bg-gray-200 active:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
                {tooManyProfiles && (
                  <TooManyProfiles
                    userCity={userCity}
                    setUserCity={setUserCity}
                    showSuggestedLocations={showSuggestedLocations}
                    setShowSuggestedLocations={setShowSuggestedLocations}
                    narrowProfiles={narrowProfiles}
                    locations={locations}
                  />
                )}
              </div>
            </DialogHeader>
            <ProfilesCarousel
              filteredProfiles={filteredProfiles}
              selectedProfiles={selectedProfiles}
              handleProfileAdd={handleProfileAdd}
              handleProfileRemove={handleProfileRemove}
            />
            <button
              onClick={navigateResults}
              className="text-[12px] lg:text-base flex justify-center items-center gap-2 rounded-3xl px-4 py-3 bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#100320] transition-colors duration-100 ease-in-out"
            >
              <Image
                src="/profileSearch/googleLogo.svg"
                alt="Google Logo"
                width={20}
                height={20}
              />
              Sign in with Google to begin removal
            </button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
