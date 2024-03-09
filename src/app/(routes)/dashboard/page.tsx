"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/lib/useUser";
import ExpandedProfileSearch from "@/app/_components/expandedProfileSearch";
import StatisticsCard from "@/app/_components/statisticsCard";
import RemovalProgressCard from "@/app/_components/removalProgressCard";
import EmailBreachesCard from "@/app/_components/emailBreachesCard";
import RemovalsTableCard from "@/app/_components/removalsTableCard";
import getAllProfiles from "./getAllProfiles";
import MonthlyModal from "./monthlyModal";

export default function Dashboard() {
  const supabase = supabaseBrowser();
  const queryClient = useQueryClient();
  let { data: user } = useUser();
  if (!user) {
    (async () => {
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
    })();
  }

  const [openDialog, setOpenDialog] = useState<boolean>(
    user &&
      user.paidForMonthlyRemoval &&
      !user.syncedRemovals &&
      user.monthlyScannedProfiles.length > 0
  );
  const [profilesRemoved, setProfilesRemoved] = useState<number>(
    user ? user.removedProfiles.length : 0
  );
  const [percentage, setPercentage] = useState<number>(
    user &&
      (user.paidForRemoval || user.paidForMonthlyRemoval) &&
      user.syncedRemovals
      ? 100
      : 0
  );
  const [removalProgressMessage, setRemovalProgressMessage] =
    useState<React.ReactNode>(
      user &&
        (user.paidForRemoval || user.paidForMonthlyRemoval) &&
        user.syncedRemovals ? (
        "Congratulations! Your profiles have been removed."
      ) : (
        <div className="relative">
          <div className="absolute -inset-2 opacity-75 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur"></div>
          <Link
            href="/#pricing"
            className="relative block text-center text-black bg-[#EFE3FF] hover:bg-[#D6C9E6] active:bg-[#BDAFCD] rounded-2xl px-5 py-3"
          >
            {/* The 'block' class on Link makes it take up entire width */}
            Remove all profiles
          </Link>
        </div>
      )
    );

  async function updateDBProfiles() {
    // update the list of profiles to include all parent and children site profiles
    // do this only when the user is brand new and just finished searching for themselves
    if (
      user &&
      user.scannedProfiles.length === 0 &&
      user.removedProfiles.length === 0
    ) {
      let allProfiles = getAllProfiles(
        JSON.parse(sessionStorage.getItem("selectedProfiles")!)
      );

      // update the user's fields in the database
      const { data, error } = await supabase
        .from("users")
        .update({
          firstName: sessionStorage.getItem("firstName"),
          lastName: sessionStorage.getItem("lastName"),
          state: sessionStorage.getItem("userState"),
          age: parseInt(sessionStorage.getItem("age")!),
          scannedProfiles: allProfiles,
        })
        .eq("id", user.id);
    }
  }

  async function initiateRemoval() {
    // get the updated user
    user = queryClient.getQueryData(["user"]);
    let numScannedProfiles = user.scannedProfiles.length;
    let numRemovedProfiles = user.removedProfiles.length;
    let numTotalProfiles = numScannedProfiles + numRemovedProfiles;

    // initiate the removal process:
    // if the user paid for the one time removal, ensure that the removals are not synced
    // if the user paid for the monthly removal, ensure that the the removals are not synced and that the there's nothing in the monthly scanned profiles (this is to prevent this function from running when the monthlyModal profiles are added)
    if (
      user &&
      ((user.paidForRemoval && !user.syncedRemovals) ||
        (user.paidForMonthlyRemoval &&
          user.monthlyScannedProfiles.length === 0 &&
          !user.syncedRemovals))
    ) {
      setRemovalProgressMessage("Do not exit this page");
      fetch(
        process.env.NODE_ENV === "development"
          ? "http://localhost:5002/remove-profile"
          : "https://api.erazer.io/remove-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
            userState: user.state,
            phoneNumber: user.phoneNumber,
            filteredProfiles: user.scannedProfiles,
          }),
        }
      ).catch((error) => console.log(error));
      // update progress bar
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      const delayTime = 2000; // 2 seconds per profile
      for (let i = 0; i < numScannedProfiles; i++) {
        await delay(delayTime);
        // update profile status
        user.scannedProfiles[i] = {
          ...user.scannedProfiles[i],
          status: "Removed",
        };
        setProfilesRemoved(numRemovedProfiles + i + 1); // update number of profiles removed
        setPercentage(((numRemovedProfiles + i + 1) / numTotalProfiles) * 100); // update percentage
      }
      setProfilesRemoved(numTotalProfiles);
      setPercentage(100);

      // update user's removed profiles
      const { data, error } = await supabase
        .from("users")
        .update({
          removedProfiles: [...user.scannedProfiles, ...user.removedProfiles],
          scannedProfiles: [],
          syncedRemovals: true,
        })
        .eq("id", user.id);

      setRemovalProgressMessage(
        "Congratulations! Your profiles have been removed."
      );
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

  const initiateRemovalMutation = useMutation({
    mutationFn: initiateRemoval,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
        exact: true,
      });
    },
  });

  useEffect(() => {
    async function updateDashboard() {
      await updateDBProfilesMutation.mutateAsync();
      await initiateRemovalMutation.mutateAsync();
    }
    updateDashboard();
  }, [user]);

  return (
    <div className="flex flex-col gap-8 py-10">
      {user && (
        <>
          <MonthlyModal
            user={user}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
          />
          {/* tablet and mobile view */}
          <h1 className="lg:hidden text-[50px] font-medium leading-[55px] tracking-[-2.5px]">
            {user.firstName !== ""
              ? `${user.firstName}'s Dashboard`
              : "Your Dashboard"}
          </h1>
          <ExpandedProfileSearch className="lg:hidden" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:hidden">
            <StatisticsCard
              heading="This month"
              value={user.scannedProfiles.length + user.removedProfiles.length}
              description="databrokers had your personal information"
            />
            <StatisticsCard
              heading="We found"
              value={user.breaches.length}
              description={`${
                user.breaches.length !== 0
                  ? "email breaches. Please change your password for each account."
                  : "email breaches. Great job on keeping your accounts secure!"
              }`}
            />
            <RemovalProgressCard
              profilesRemoved={profilesRemoved}
              percentage={percentage}
              removalProgressMessage={removalProgressMessage}
            />
            <EmailBreachesCard breaches={user.breaches} className="" />
            <RemovalsTableCard
              profiles={[...user.scannedProfiles, ...user.removedProfiles]}
              className="md:col-span-2"
            />
          </div>
          {/* desktop view */}
          <div className="hidden lg:flex flex-row gap-8">
            <div className="flex flex-col gap-8">
              <h1 className="text-[50px] font-medium leading-[55px] tracking-[-2.5px]">
                {user.firstName !== ""
                  ? `${user.firstName}'s Dashboard`
                  : "Your Dashboard"}
              </h1>
              <ExpandedProfileSearch />
              <div className="flex flex-row gap-8">
                <StatisticsCard
                  className="w-[50%]"
                  heading="This month"
                  value={
                    user.scannedProfiles.length + user.removedProfiles.length
                  }
                  description="databrokers had your personal information"
                />
                <StatisticsCard
                  heading="We found"
                  value={user.breaches.length}
                  description={`${
                    user.breaches.length !== 0
                      ? "email breaches. Please change your password for each account."
                      : "email breaches. Great job on keeping your accounts secure!"
                  }`}
                />
              </div>
              <RemovalsTableCard
                profiles={[...user.scannedProfiles, ...user.removedProfiles]}
              />
            </div>
            <div className="flex flex-col gap-8">
              <RemovalProgressCard
                profilesRemoved={profilesRemoved}
                percentage={percentage}
                removalProgressMessage={removalProgressMessage}
              />
              <EmailBreachesCard breaches={user.breaches} className="" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
