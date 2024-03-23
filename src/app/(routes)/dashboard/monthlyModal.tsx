"use client";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/lib/supabase/browser";
import ProfilesCarousel from "@/app/_components/profileSearch/profilesCarousel";
import TooManyProfiles from "@/app/_components/profileSearch/tooManyProfiles";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { type CarouselApi } from "@/components/ui/carousel";
import { Profile } from "@/app/types/Profile";
import { User } from "@/app/types/User";
import { databrokers } from "@/app/types/Databrokers";
import getAllProfiles from "./getAllProfiles";

interface MonthlyModalProps {
  user: User;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

export default function MonthlyModal({
  user,
  openDialog,
  setOpenDialog,
}: MonthlyModalProps) {
  const { toast } = useToast();
  const supabase = supabaseBrowser();
  const queryClient = useQueryClient();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [heading, setHeading] = useState<string>(
    "Here are your monthly scanned profiles"
  );
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>(
    user.monthlyScannedProfiles
  );
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [tooManyProfiles, setTooManyProfiles] = useState<boolean>(
    user.monthlyScannedProfiles.length > 10
  );
  const [locations, setLocations] = useState<string[]>([]);
  const [userCity, setUserCity] = useState<string>("");
  const [showSuggestedLocations, setShowSuggestedLocations] =
    useState<boolean>(false);

  useEffect(() => {
    updateLocations(filteredProfiles);
  }, []);

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
      carouselApi?.scrollTo(0); // reset the index of the carousel to 0 (so we don't start on the current slide with the updated profiles)
      setFilteredProfiles(profilesFiltered);
      updateLocations(profilesFiltered);
    }
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

  async function updateDBProfiles() {
    // we won't check if they selected at least one profile because it can be the case that no profile matched them

    // for all selected profiles, add a field to the object called "status" and set it to "Pending"
    let selectedProfilesWithStatus: Profile[] = selectedProfiles.map(
      (profile: Profile) => ({
        ...profile,
        status: "Pending",
      })
    );

    selectedProfilesWithStatus = getAllProfiles(selectedProfilesWithStatus);

    // update the user's profile with the selected profiles
    const { data, error } = await supabase
      .from("users")
      .update({
        scannedProfiles: [
          ...selectedProfilesWithStatus,
          ...user.scannedProfiles,
        ],
        monthlyScannedProfiles: [],
        syncedRemovals: false, // since the user added new profile(s), removals are no longer synced
      })
      .eq("id", user?.id);

    // close the dialog
    setOpenDialog(false);

    if (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "An error occurred while updating your profile.",
      });
      return;
    }
  }

  const updateDBProfilesMutation = useMutation({
    mutationFn: updateDBProfiles,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
        exact: true,
      });
    },
  });

  return (
    <div>
      <Dialog open={openDialog}>
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
            databrokers={databrokers}
          />
          <button
            onClick={() => updateDBProfilesMutation.mutateAsync()}
            className="text-[12px] lg:text-base flex justify-center items-center gap-2 rounded-3xl px-4 py-3 bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#100320] transition-colors duration-100 ease-in-out"
          >
            Confirm
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
