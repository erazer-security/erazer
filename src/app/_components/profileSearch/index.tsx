"use client";
import { useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/browser";
import SearchBar from "@/app/_components/searchBar";
import Globe from "@/app/_components/globe";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type CarouselApi } from "@/components/ui/carousel";
import { Profile } from "@/app/types/Profile";
import { databrokers } from "@/app/types/Databrokers";
import ProfilesCarousel from "./profilesCarousel";
import TooManyProfiles from "./tooManyProfiles";

export default function ProfileSearch() {
  const supabase = supabaseBrowser();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
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
  const allDatabrokers = Object.values(databrokers).flat(); // flatten the array of arrays
  const [currentDatabroker, setCurrentDatabroker] = useState<string>(
    allDatabrokers[0]
  );

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

    // reset all states
    setUserCity("");
    setLocations([]);
    setFilteredProfiles([]);
    setSelectedProfiles([]);
    setLoading(true);
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
      .then((response) => {
        if (!response.ok) {
          setOpenDialog(false);
          toast({
            variant: "destructive",
            description: `${firstName}, there was an error while scraping your profile. Please try again.`,
          });
          setLoading(false);
          setProgress(0); // reset progress bar
          setCurrentDatabroker(allDatabrokers[0]);
          return;
        }
        return response.json();
      })
      .then((data) => {
        isFetchCompleted = true; // all fetch requests are completed
        const profilesFiltered = data.profiles.filter(
          (profile: Profile) => profile.age == age || profile.age == 0 // get profiles with matching ages or no ages shown (could be user)
        );
        if (profilesFiltered.length === 0) {
          setOpenDialog(false);
          toast({
            variant: "success",
            description: `${firstName}, it looks like your profile doesn't exist on these databrokers.`,
          });
          setLoading(false);
          setProgress(0); // reset progress bar
          setCurrentDatabroker(allDatabrokers[0]);
          return;
        } else {
          setFilteredProfiles(profilesFiltered);
          updateLocations(profilesFiltered);

          if (profilesFiltered.length === 1) {
            setHeading("We found 1 profile.");
          } else {
            setHeading(`We found ${profilesFiltered.length} profiles.`);
            if (profilesFiltered.length > 10) {
              setTooManyProfiles(true);
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
        setOpenDialog(false);
        toast({
          variant: "destructive",
          description: `${firstName}, there was an error while scraping your profile. Please try again.`,
        });
        setLoading(false);
        setProgress(0); // reset progress bar
        setCurrentDatabroker(allDatabrokers[0]);
        return;
      });

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

    if (profilesFiltered.length === 0) {
      setHeading("It looks like your city doesn't match any of the profiles.");
      return;
    } else {
      setHeading("These are the profiles that match your city.");
      carouselApi?.scrollTo(0); // reset the index of the carousel to 0 (so we don't start on the current slide with the updated profiles)
      setFilteredProfiles(profilesFiltered);
      updateLocations(profilesFiltered);
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

  async function navigateResults() {
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

    // set necessary removal information in session and navigate to sign in page
    sessionStorage.setItem("firstName", firstName);
    sessionStorage.setItem("lastName", lastName);
    sessionStorage.setItem("userState", userState);
    sessionStorage.setItem("age", age.toString());
    sessionStorage.setItem(
      "selectedProfiles",
      JSON.stringify(selectedProfilesWithStatus)
    );

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/dashboard"
            : "https://erazer.io/dashboard",
      },
    });
    if (error) {
      console.error(error);
    }
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
          <DialogContent className="justify-center px-10 py-14 outline-none">
            <DialogHeader className="gap-5">
              <DialogTitle className="text-center text-pretty">
                {heading}
              </DialogTitle>
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
              setCarouselApi={setCarouselApi}
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
