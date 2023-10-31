import styles from "./Results.module.css";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Profile } from "@components/types";

function Results() {
  const location = useLocation();
  const { profiles } = location.state;
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
  const { user } = useSelector((state: any) => state.user);

  let allProfiles: Profile[] = [];
  profiles.forEach((profile: Profile) => {
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
  });

  const [removalStatus, setRemovalStatus] = useState<string[]>(
    Array(allProfiles.length).fill("In Progress")
  );

  const [isRemovalCompleted, setIsRemovalCompleted] = useState<boolean>(false); // tracker to update all removal status to "Removed" when removal is completed
  const removalInitiated = useRef<boolean>(false); // tracker to initiate removal only once

  async function initiateRemoval() {
    // Track when fetch request is completed to update progress bar
    let isFetchCompleted: boolean = false;

    const removeProfilePromise = fetch("https://api.erazer.io/remove-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        userState: user.userState,
        filteredProfiles: profiles,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        isFetchCompleted = true;
        setIsRemovalCompleted(true);
        localStorage.setItem("removalReady", "false");
      })
      .catch((error) => console.error(error));
    // update progress bar
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const updateRemovalPromise = (async () => {
      const delayTime = 1000; // 1 second per profile

      for (let i = 0; i < removalStatus.length; i++) {
        if (isFetchCompleted) {
          break;
        }

        await delay(delayTime);
        setRemovalStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[i] = "Removed";
          return newStatus;
        });
      }
    })();

    await Promise.all([removeProfilePromise, updateRemovalPromise]);
  }

  useEffect(() => {
    if (
      !removalInitiated.current &&
      localStorage.getItem("removalReady") === "true"
    ) {
      initiateRemoval();
      removalInitiated.current = true;
    } else if (localStorage.getItem("removalReady") === "false") {
      // set all profiles to removed
      if (isRemovalCompleted) {
        setRemovalStatus(Array(removalStatus.length).fill("Removed"));
      }
    }
  }, [isRemovalCompleted]);

  return (
    <div className={styles.container}>
      {/* Desktop Table */}
      {!isMobile && (
        <TableContainer className={styles.table}>
          <Table>
            <Thead>
              <Tr>
                <Th style={{ color: "white" }}>Found On</Th>
                <Th style={{ color: "white" }}>Personal Information</Th>
                <Th style={{ color: "white" }}>Removal Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allProfiles?.map((profile: Profile, index: number) => {
                return (
                  <Tr key={index}>
                    <Td>{profile.website}</Td>
                    <Td>{profile.profile.slice(0, 75)}...</Td>
                    <Td>
                      {removalStatus[index] === "In Progress" ? (
                        <div className={styles.inProgressBox}>In Progress</div>
                      ) : (
                        <div className={styles.removedBox}>Removed</div>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile Table */}
      {isMobile && (
        <TableContainer className={styles.mobileTable}>
          <Table>
            <Thead>
              <Tr>
                <Th style={{ color: "white" }}>Info</Th>
                <Th style={{ color: "white" }}>Removal</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allProfiles?.map((profile: Profile, index: number) => {
                return (
                  <Tr key={index}>
                    <Td className={styles.mobileInfo}>
                      <div>{profile.website}</div>
                      <div>{profile.profile.slice(0, 25)}</div>
                    </Td>
                    <Td>
                      {removalStatus[index] === "In Progress" ? (
                        <div className={styles.mobileInProgressBox}>
                          In Progress
                        </div>
                      ) : (
                        <div className={styles.mobileRemovedBox}>Removed</div>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default Results;
