"use client";
import { useState, useEffect } from "react";
import SideNav from "@/app/_components/sideNav";
import StatisticsCard from "@/app/_components/statisticsCard";
import RemovalProgressCard from "@/app/_components/removalProgressCard";
import EmailBreachesCard from "@/app/_components/emailBreachesCard";
import RemovalsTableCard from "@/app/_components/removalsTableCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Profile } from "@/app/types/Profile";
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
  whoisDatabrokers,
} from "@/app/types/Databrokers";
import { User } from "@/app/types/User";
import { useRouter } from "next/navigation";

let stripePromise: any;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_KEY}`);
  }
  return stripePromise;
};

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

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [profilesRemoved, setProfilesRemoved] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  let user: User | undefined = queryClient.getQueryData(["user"]);
  if (!user) {
    router.push(
      process.env.NODE_ENV === "development"
        ? "http://localhost:5001/auth/google"
        : "https://authentication.erazer.io/auth/google"
    );
  }

  const item = {
    price: `${process.env.NEXT_PUBLIC_STRIPE_PRICE_ID}`,
    quantity: 1,
  };

  const checkoutOptions = {
    lineItems: [item],
    mode: "payment",
    successUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/dashboard"
        : "https://erazer.io/dashboard",
    cancelUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/dashboard"
        : "https://erazer.io/dashboard",
    customerEmail: user?.email,
  };

  const redirectToCheckout = async () => {
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
    console.error("Stripe checkout error", error);
  };

  const [removalProgressMessage, setRemovalProgressMessage] =
    useState<React.ReactNode>(
      <button
        onClick={redirectToCheckout}
        className="w-full bg-[#EFE3FF] hover:bg-[#D6C9E6] active:bg-[#BDAFCD] text-black rounded-2xl px-5 py-3"
      >
        Remove all profiles for $9.99
      </button>
    );

  async function updateDBProfiles() {
    // update the list of profiles to include all parent and children site profiles
    if (user && !user.paidForRemoval && !user.syncedRemovals) {
      if (
        // only update the list of profiles once, i.e. if the user comes back to the site at a later time, don't update the profiles again.
        sessionStorage.getItem("selectedProfiles") &&
        user.scannedProfiles.length !==
          JSON.parse(sessionStorage.getItem("selectedProfiles")!).length
      ) {
        let allProfiles: Profile[] = [];

        JSON.parse(sessionStorage.getItem("selectedProfiles")!).forEach(
          (profile: Profile) => {
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
          }
        );

        sessionStorage.setItem("selectedProfiles", JSON.stringify(allProfiles)); // update selected profiles in session storage

        // update the user fields and send the updated list of profiles to the backend
        await fetch(
          process.env.NODE_ENV === "development"
            ? "http://localhost:5001/update-user-and-profiles"
            : "https://authentication.erazer.io/update-user-and-profiles",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              firstName: sessionStorage.getItem("firstName"),
              lastName: sessionStorage.getItem("lastName"),
              userState: sessionStorage.getItem("userState"),
              age: sessionStorage.getItem("age"),
              profiles: allProfiles,
            }),
          }
        ).then((response) => response.json());
      }
    }
  }

  async function initiateRemoval() {
    // get the updated user
    user = queryClient.getQueryData(["user"]);

    if (user && user.paidForRemoval && !user.syncedRemovals) {
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
            filteredProfiles: user.scannedProfiles,
          }),
        }
      ).catch((error) => console.log(error));

      // update progress bar
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const delayTime = 2000; // 2 seconds per profile

      for (let i = 0; i < user.scannedProfiles.length; i++) {
        await delay(delayTime);
        // update profile status
        user.scannedProfiles[i] = {
          ...user.scannedProfiles[i],
          status: "Removed",
        };
        setProfilesRemoved(i + 1); // update number of profiles removed
        setPercentage(((i + 1) / user.scannedProfiles.length) * 100); // update percentage
      }

      setProfilesRemoved(user.scannedProfiles.length);
      setPercentage(100);

      // send updated profiles to backend
      await fetch(
        process.env.NODE_ENV === "development"
          ? "http://localhost:5001/update-removedProfiles"
          : "https://authentication.erazer.io/update-removedProfiles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            profiles: user.scannedProfiles,
            syncedRemovals: true,
          }),
        }
      ).then((response) => {
        response.json();
        setRemovalProgressMessage(
          "Congratulations! Your profiles have been removed."
        );
      });
    }
  }

  const updateDBProfilesMutation = useMutation({
    mutationFn: updateDBProfiles,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"], exact: true });
    },
  });

  const initiateRemovalMutation = useMutation({
    mutationFn: initiateRemoval,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"], exact: true });
    },
  });

  useEffect(() => {
    async function updateDashboard() {
      await updateDBProfilesMutation.mutateAsync();
      await initiateRemovalMutation.mutateAsync();
      if (user && user.paidForRemoval && user.syncedRemovals) {
        setProfilesRemoved(user.removedProfiles.length);
        setPercentage(100);
        setRemovalProgressMessage(
          "Congratulations! Your profiles have been removed."
        );
      }
    }
    updateDashboard();
  }, []);

  return (
    <div className="flex flex-col gap-8 py-10">
      {user && (
        <>
          {/* tablet and mobile view */}
          <h1 className="lg:hidden text-[50px] font-medium leading-[55px] tracking-[-2.5px]">
            {user.firstName}'s Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:hidden">
            <StatisticsCard
              heading="This month"
              value={user.scannedProfiles.length + user.removedProfiles.length}
              description="databrokers had your personal information"
            />
            <StatisticsCard
              heading="We found"
              value={user.breaches ? user.breaches.length : 0}
              description={`${
                user.breaches
                  ? "email breaches. Please change your password for each account."
                  : "email breaches. Great job on keeping your accounts secure!"
              }`}
            />
            <RemovalProgressCard
              profilesRemoved={profilesRemoved}
              percentage={percentage}
              removalProgressMessage={removalProgressMessage}
              redirectToCheckout={redirectToCheckout}
            />
            <EmailBreachesCard breaches={user.breaches} className="" />
            <RemovalsTableCard
              whoisDatabrokers={whoisDatabrokers}
              profiles={[...user.scannedProfiles, ...user.removedProfiles]}
              className="md:col-span-2"
            />
          </div>
          {/* desktop view */}
          <div className="hidden lg:flex flex-row gap-8">
            {/* <SideNav className="" /> */}
            <div className="flex flex-col gap-8">
              <h1 className="text-[50px] font-medium leading-[55px] tracking-[-2.5px]">
                {user.firstName}'s Dashboard
              </h1>
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
                  value={user.breaches ? user.breaches.length : 0}
                  description={`${
                    user.breaches
                      ? "email breaches. Please change your password for each account."
                      : "email breaches. Great job on keeping your accounts secure!"
                  }`}
                  className="w-[50%]"
                />
              </div>
              <RemovalsTableCard
                whoisDatabrokers={whoisDatabrokers}
                profiles={[...user.scannedProfiles, ...user.removedProfiles]}
              />
            </div>
            <div className="flex flex-col gap-8">
              <RemovalProgressCard
                profilesRemoved={profilesRemoved}
                percentage={percentage}
                redirectToCheckout={redirectToCheckout}
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
