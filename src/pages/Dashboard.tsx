import styles from "./Dashboard.module.css";
import { useState, useEffect, ReactNode } from "react";
import { HashLink } from "react-router-hash-link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SemiCircleProgress } from "react-semicircle-progressbar";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { CalendarIcon, CopyIcon, EmailIcon } from "@chakra-ui/icons";
import { loadStripe } from "@stripe/stripe-js";
import { isMobile } from "react-device-detect";
import { Profile } from "@components/types";
import { Route, routes } from "@components/routes";
import { PageRoutes } from "@components/types";
import { Breach } from "@components/types";
import {
  truthRecordSites,
  peoplesWizSites,
  newenglandFactsSites,
  usaOfficialSites,
  floridaResidentsDirectorySites,
  spokeoSites,
  beenVerifiedSites,
} from "@components/databrokers";

let stripePromise: any;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_KEY}`);
  }

  return stripePromise;
};

// the routes to display on the left nav
const pageRoutes: PageRoutes = {
  Dashboard: CalendarIcon,
  "Hall of Horror": CopyIcon,
  Feedback: EmailIcon,
};

const siteMapping: any = {
  "truthrecord.org": truthRecordSites,
  "peopleswiz.com": peoplesWizSites,
  "newenglandfacts.com": newenglandFactsSites,
  "usaofficial.info": usaOfficialSites,
  "usa-official.com": usaOfficialSites,
  "floridaresidentsdirectory.com": floridaResidentsDirectorySites,
  "spokeo.com": spokeoSites,
  "beenverified.com": beenVerifiedSites,
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  let user: any | undefined = queryClient.getQueryData(["user"]);
  const [profilesRemoved, setProfilesRemoved] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  const redirectToCheckout = async () => {
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
    console.log("Stripe checkout error", error);
  };

  const [removalProcessText, setRemovalProcessText] = useState<
    string | ReactNode
  >(
    user && user.paidForRemoval && user.removalComplete ? (
      "Congratulations! Your profiles have been removed."
    ) : (
      <button onClick={redirectToCheckout} className={styles.removeAllButton}>
        Remove all profiles for $9.99
      </button>
    )
  );

  const item = {
    price: `${import.meta.env.VITE_STRIPE_PRICE_ID}`,
    quantity: 1,
  };

  const checkoutOptions = {
    lineItems: [item],
    mode: "payment",
    successUrl:
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "http://localhost:5173/dashboard"
        : "https://erazer.io/dashboard",
    cancelUrl:
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "http://localhost:5173/dashboard"
        : "https://erazer.io/dashboard",
    customerEmail: user.email,
  };

  async function updateDBProfiles() {
    // update the list of profiles to include all truth record and peoples wiz sites
    if (
      user &&
      !user.paidForRemoval &&
      !user.removalComplete &&
      user.profiles.length !==
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

      // send the updated list of profiles to the backend
      await fetch(
        import.meta.env.VITE_NODE_ENV === "DEV"
          ? "http://localhost:5001/updateStateAndProfiles"
          : "https://authentication.erazer.io/updateStateAndProfiles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            state: sessionStorage.getItem("userState"),
            profiles: allProfiles,
          }),
        }
      ).then((response) => response.json());
    }
  }

  async function initiateRemoval() {
    // get the updated user
    user = queryClient.getQueryData(["user"]);

    if (user && user.paidForRemoval && !user.removalComplete) {
      setRemovalProcessText("Do not exit this page");

      fetch(
        import.meta.env.VITE_NODE_ENV === "DEV"
          ? "http://localhost:5002/remove-profile"
          : "https://api.erazer.io/remove-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // since first name and last name of what the user eneterd could be different from what's on their account, use session storage variables
            firstName: sessionStorage.getItem("firstName"),
            lastName: sessionStorage.getItem("lastName"),
            userState: sessionStorage.getItem("userState"),
            filteredProfiles: user.profiles,
          }),
        }
      ).catch((error) => console.log(error));

      // update progress bar
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const delayTime = 2000; // 2 seconds per profile

      let profiles2: Profile[] = user.profiles;

      for (let i = 0; i < profiles2.length; i++) {
        await delay(delayTime);
        // update profile status
        profiles2 = profiles2.map((profile: Profile, index: number) =>
          index === i
            ? {
                ...profile,
                status: "Removed",
              }
            : profile
        );
        setProfilesRemoved(i + 1); // update number of profiles removed
        setPercentage(((i + 1) / profiles2.length) * 100); // update percentage
        // manually update queryClient cache of user.profiles[i].status
        queryClient.setQueryData(["user"], (oldData: any) => {
          return {
            ...oldData,
            profiles: profiles2,
          };
        });
      }

      setProfilesRemoved(profiles2.length);
      setPercentage(100);

      // set all "user.profiles.status" to "Removed"
      queryClient.setQueryData(["user"], (oldData: any) => {
        return {
          ...oldData,
          profiles: profiles2,
        };
      });

      // send updated profiles to backend
      await fetch(
        import.meta.env.VITE_NODE_ENV === "DEV"
          ? "http://localhost:5001/updateProfiles"
          : "https://authentication.erazer.io/updateProfiles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            profiles: profiles2,
            removalComplete: true,
          }),
        }
      ).then((response) => {
        response.json();
        setRemovalProcessText(
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
      if (user && user.paidForRemoval && user.removalComplete) {
        setPercentage(100);
        setProfilesRemoved(user.profiles.length);
      }
    }
    updateDashboard();
  }, []);

  return (
    <>
      <div className={styles.leftNavContainer}>
        <div className={styles.routes}>
          {routes.map(
            (route: Route, index: number) =>
              pageRoutes[route.title] &&
              (route.title == "Dashboard" ? (
                <div key={index} className={styles.highlightedRouteContainer}>
                  <div className={styles.highlightedRoute}>
                    <Icon as={pageRoutes[route.title]} boxSize={5} />
                    <HashLink
                      to={route.path}
                      className={styles.highlightedRouteLink}
                    >
                      {route.title}
                    </HashLink>
                  </div>
                </div>
              ) : (
                <div key={index} className={styles.route}>
                  <Icon as={pageRoutes[route.title]} boxSize={5} />
                  <HashLink to={route.path} className={styles.routeLink}>
                    {route.title}
                  </HashLink>
                </div>
              ))
          )}
        </div>
      </div>
      <div className={styles.dashboardsContainer}>
        <div className={styles.dashboards}>
          <div className={styles.row1cards}>
            <div className={styles.removalProcessCard}>
              <p className={styles.removalProcessHeading}>Removal Process</p>
              <div className={styles.progressCircleContainer}>
                <SemiCircleProgress
                  percentage={percentage}
                  size={{
                    width: 210,
                    height: 200,
                  }}
                  strokeWidth={15}
                  strokeColor="#6736F5"
                  hasBackground={true}
                  bgStrokeColor="#100424"
                  fontStyle={{
                    fontSize: "0px",
                    fontWeight: "normal",
                    fill: "#FFFFFF",
                  }}
                />
                <div className={styles.progressCircleTextContainer}>
                  <p className={styles.progressCircleNumber}>
                    {profilesRemoved}
                  </p>
                  <p className={styles.progressCircleNumberText}>
                    Profiles Removed
                  </p>
                </div>
              </div>
              <div
                className={
                  typeof removalProcessText === "string"
                    ? styles.removalProcessSubHeading
                    : ""
                }
              >
                {removalProcessText}
              </div>
            </div>
            {!user.breaches ? (
              <div className={styles.emailBreachesCard}>
                <p className={styles.emailBreachesHeading}>
                  Looks Like Your Email Hasn't Been Involved In A Breach
                </p>
              </div>
            ) : (
              <div className={styles.emailBreachesCard}>
                <p className={styles.emailBreachesHeading}>
                  Your Email Has Been Breached On The Dark Web
                </p>
                <Accordion
                  defaultIndex={[0]}
                  allowMultiple
                  className={styles.emailBreachesTable}
                >
                  {user.breaches?.map((breach: Breach, index: number) => {
                    return (
                      <AccordionItem key={index}>
                        <AccordionButton>
                          <Box
                            as="span"
                            flex="1"
                            textAlign="left"
                            className={styles.breachTitle}
                          >
                            {breach.Title} {breach.BreachDate}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <p
                            className={styles.breachDescription}
                            dangerouslySetInnerHTML={{
                              __html: breach.Description,
                            }}
                          ></p>
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            )}
          </div>
          <div className={styles.removalCard}>
            <p className={styles.removalHeading}>Overview</p>
            <div className={styles.removalTable}>
              {isMobile ? (
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th style={{ color: "white" }}>Info</Th>
                        <Th style={{ color: "white" }}>Removal</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {user.profiles?.map((profile: any, index: number) => (
                        <Tr key={index}>
                          <Td className={styles.mobileInfo}>
                            <div>{profile.website}</div>
                            <div>{profile.profile.slice(0, 25)}...</div>
                          </Td>
                          <Td>
                            {profile.status === "Pending" ? (
                              <div className={styles.mobileInProgressBox}>
                                Pending
                              </div>
                            ) : (
                              <div className={styles.mobileRemovedBox}>
                                Removed
                              </div>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th style={{ color: "white" }}>Found On</Th>
                        <Th style={{ color: "white" }}>Personal Information</Th>
                        <Th style={{ color: "white" }}>Removal Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {user.profiles?.map((profile: any, index: number) => (
                        <Tr key={index}>
                          <Td className={styles.removalSite}>
                            {profile.website}
                          </Td>
                          <Td style={{ width: "100%" }}>
                            <Accordion allowToggle>
                              <AccordionItem border="none">
                                <AccordionButton>
                                  <Box flex="1" textAlign="left">
                                    <p className={styles.removalInformation}>
                                      {profile.profile.slice(0, 50)}...
                                    </p>
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                  <p className={styles.removalInformation}>
                                    {profile.profile}
                                  </p>
                                </AccordionPanel>
                              </AccordionItem>
                            </Accordion>
                          </Td>
                          <Td>
                            {profile.status === "Pending" ? (
                              <div className={styles.inProgressBox}>
                                Pending
                              </div>
                            ) : (
                              <div className={styles.removedBox}>Removed</div>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
