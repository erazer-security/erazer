import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/lib/useUser";
import SearchBar from "@/app/_components/expandedProfileSearch/searchBar";
import ProfilesCarousel from "@/app/_components/profileSearch/profilesCarousel";
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
import { advancedDatabrokers } from "@/app/types/Databrokers";

interface ExpandedProfileSearchProps {
  className?: string;
}

export default function ExpandedProfileSearch({
  className,
}: ExpandedProfileSearchProps) {
  const { toast } = useToast();
  const supabase = supabaseBrowser();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const allDatabrokers = Object.values(advancedDatabrokers).flat(); // flatten the array of arrays
  const [currentDatabroker, setCurrentDatabroker] = useState<string>(
    allDatabrokers[0]
  );

  async function searchProfile() {
    if (phoneNumber.length !== 10) {
      toast({
        variant: "destructive",
        description: "Please enter a valid phone number.",
      });
      return;
    }
    setFilteredProfiles([]);
    setSelectedProfiles([]);
    setLoading(true);
    setOpenDialog(true);
    setHeading(`Hi ${user.firstName}, we are searching for your phone number.`);

    // Track when fetch request is completed to update progress bar
    let isFetchCompleted: boolean = false;
    // Fetch the profile, if it exists, from the server
    const fetchProfilesPromise = fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:5002/expanded-profiles"
        : "https://api.erazer.io/expanded-profiles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          number: phoneNumber,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          setOpenDialog(false);
          toast({
            variant: "destructive",
            description: `${user.firstName}, there was an error while scraping your number. Please try again.`,
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
        if (data.profiles.length === 0) {
          setOpenDialog(false);
          toast({
            variant: "success",
            description: `${user.firstName}, it looks like your number doesn't exist on these databrokers.`,
          });
          setLoading(false);
          setProgress(0); // reset progress bar
          setCurrentDatabroker(allDatabrokers[0]);
          return;
        } else {
          setFilteredProfiles(data.profiles);
          setHeading(`We found ${data.profiles.length} phone numbers.`);
        }
      });

    // update progress bar
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const updateProgressBarPromise = (async () => {
      const totalDelayTime = 10000; // 10 seconds
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

  async function updateDBProfiles() {
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

    // update the user's profile with the selected profiles
    const { data, error } = await supabase
      .from("users")
      .update({
        scannedProfiles: [
          ...selectedProfilesWithStatus,
          ...user.scannedProfiles,
        ],
        syncedRemovals: false, // since the user added new profile(s), removals are no longer synced
        phoneNumber: phoneNumber,
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
    <div className={`${className}`}>
      <SearchBar
        setPhoneNumber={setPhoneNumber}
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
              onClick={() => updateDBProfilesMutation.mutateAsync()}
              className="text-[12px] lg:text-base flex justify-center items-center gap-2 rounded-3xl px-4 py-3 bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#100320] transition-colors duration-100 ease-in-out"
            >
              Confirm
            </button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
