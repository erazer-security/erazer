import styles from "./Dashboard.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "@chakra-ui/react";
import {
  CalendarIcon,
  SearchIcon,
  CopyIcon,
  EmailIcon,
} from "@chakra-ui/icons";
import { htmlToText } from "html-to-text";
import { isMobile } from "react-device-detect";
import { Profile } from "@components/types";
import { Route, routes } from "@components/routes";

interface PageRoutes {
  [key: string]: typeof Icon;
}

// the routes to display on the left nav
const pageRoutes: PageRoutes = {
  Dashboard: CalendarIcon,
  "Private Investigator": SearchIcon,
  "Wall of Horror": CopyIcon,
  Feedback: EmailIcon,
};

const truthRecordSites: string[] = [
  "weinform.org",
  "privatereports.com",
  "personsearchers.com",
  "backgroundcheckers.net",
  "checksecrets.com",
  "inmatessearcher.com",
  "mugshotlook.com",
  "peoplesearch123.com",
  "peoplesearcher.com",
  "peoplesearchusa.org",
  "personsearchers.com",
  "privaterecords.net",
  "publicsearcher.com",
  "sealedrecords.net",
  "secretinfo.org",
];
const peoplesWizSites: string[] = [
  "peopleswhizr.com",
  "peopleswizard.com",
  "people-wizard.com",
  "peoplewhiz.com",
  "peoplewhiz.net",
  "peoplewhized.com",
  "peoplewhized.net",
  "peoplewhizr.com",
  "peoplewhizr.net",
  "peoplewiz.com",
  "peoplewizard.net",
  "peoplewizr.com",
];

export default function Dashboard() {
  const queryClient = useQueryClient();
  const user: any | undefined = queryClient.getQueryData(["user"]);
  const [profilesRemoved, setProfilesRemoved] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  async function updateDBProfiles() {
    if (user && !user.removalComplete) {
      let allProfiles: Profile[] = [];
      JSON.parse(localStorage.getItem("selectedProfiles")!).forEach(
        (profile: Profile) => {
          allProfiles.push(profile);

          if (profile.website === "truthrecord.org") {
            truthRecordSites.forEach((site) => {
              allProfiles.push({
                ...profile,
                website: site,
              });
            });
          } else if (profile.website === "peopleswiz.com") {
            peoplesWizSites.forEach((site) => {
              allProfiles.push({
                ...profile,
                website: site,
              });
            });
          }
        }
      );

      localStorage.setItem("selectedProfiles", JSON.stringify(allProfiles));

      // await fetch("http://localhost:5001/auth/google", {
      await fetch("https://auth.erazer.io/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          profiles: JSON.parse(localStorage.getItem("selectedProfiles")!),
        }),
      }).then((response) => response.json());
    }
  }

  async function initiateRemoval() {
    if (user && !user.removalComplete) {
      // Track when fetch request is completed to update progress bar
      let isFetchCompleted: boolean = false;

      // const removeProfilePromise = fetch("https://api.erazer.io/remove-profile", {
      //   const removeProfilePromise = fetch(
      //     "http://localhost:5002/remove-profile",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         firstName: user.firstName,
      //         lastName: user.lastName,
      //         userState: user.userState,
      //         filteredProfiles: user2.profiles,
      //       }),
      //     }
      //   )
      //     .then((response) => response.json())
      //     .then((data) => {
      //       data;
      //       isFetchCompleted = true;
      //     })
      //     .catch((error) => console.log(error));

      // update progress bar
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const updateRemovalPromise = (async () => {
        const delayTime = 1000; // 1 second per profile
        let profiles2: Profile[] = JSON.parse(
          localStorage.getItem("selectedProfiles")!
        );

        for (let i = 0; i < profiles2.length; i++) {
          if (isFetchCompleted) {
            break;
          }

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

        // await fetch("http://localhost:5001/auth/google", {
        await fetch("https://auth.erazer.io/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            profiles: profiles2,
            removalComplete: true,
          }),
        }).then((response) => response.json());
      })();

      //   await Promise.all([removeProfilePromise, updateRemovalPromise]);
      await Promise.all([updateRemovalPromise]);
    }
  }

  const updateDBProfilesMutation = useMutation({
    mutationFn: updateDBProfiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"], exact: true });
    },
  });

  const initiateRemovalMutation = useMutation({
    mutationFn: initiateRemoval,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"], exact: true });
    },
  });

  useEffect(() => {
    async function updateDashboard() {
      await updateDBProfilesMutation.mutateAsync();
      await initiateRemovalMutation.mutateAsync();
      if (user && user.removalComplete) {
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
                <div className={styles.highlightedRouteContainer}>
                  <div key={index} className={styles.highlightedRoute}>
                    <Icon as={pageRoutes[route.title]} boxSize={5} />
                    <Link
                      to={route.path}
                      className={styles.highlightedRouteLink}
                    >
                      {route.title}
                    </Link>
                  </div>
                </div>
              ) : (
                <div key={index} className={styles.route}>
                  <Icon as={pageRoutes[route.title]} boxSize={5} />
                  <Link to={route.path} className={styles.routeLink}>
                    {route.title}
                  </Link>
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
              <p className={styles.removalProcessSubHeading}>
                Do not exit this page
              </p>
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
                  Your Email Has Been Breached In The Following Places
                </p>
                <div className={styles.emailBreachesTable}>
                  <TableContainer>
                    <Table>
                      <Tbody>
                        <Tr>
                          <Td></Td>
                        </Tr>
                        {user.breaches?.map(
                          (
                            breach: any, // add type for breach {}
                            index: number
                          ) => (
                            <Tr key={index}>
                              <Td className={styles.emailBreachesTableData}>
                                <p className={styles.breachTitle}>
                                  {breach.Title} {breach.BreachDate}
                                </p>
                                <p
                                  className={styles.breachDescription}
                                  // dangerouslySetInnerHTML={{
                                  //   __html: breach.Description,
                                  // }}
                                >
                                  {htmlToText(breach.Description).slice(0, 100)}
                                  ...
                                </p>
                              </Td>
                            </Tr>
                          )
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </div>
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
                            {profile.status === "In Progress" ? (
                              <div className={styles.mobileInProgressBox}>
                                In Progress
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
                          <Td className={styles.removalInformation}>
                            {profile.profile.slice(0, 50)}...
                          </Td>
                          <Td>
                            {profile.status === "In Progress" ? (
                              <div className={styles.inProgressBox}>
                                In Progress
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