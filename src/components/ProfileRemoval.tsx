import styles from "./ProfileRemoval.module.css";
import { Input, Select, Button } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "@components/ProgressBar";

export default function ProfileRemoval() {
  const [heading, setHeading] = useState<string | JSX.Element>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userState, setUserState] = useState<string>("All States");
  const [profiles, setProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>("");
  const [progressFact, setProgressFact] = useState<string>("");

  const states: string[] = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const databrokers: string[] = [
    "weinform.org",
    "truthrecord.org",
    "privatereports.org",
    "personsearchers.com",
    "backgroundcheckers.net",
    "checksecrets.com",
    "inmatesearcher.com",
    "mugshotlook.com",
    "peoplesearch123.com",
    "peoplesearcher.com",
    "peoplesearchusa.org",
    "personsearcher.com",
    "privaterecords.net",
    "publicsearcher.com",
    "sealedrecords.net",
    "secretinfo.org",
  ];

  const cybersecurityFacts: string[] = [
    "Are you ready for some cybersecurity facts?",
    "Cybercrime is the fastest growing crime in the US.",
    "In 2022, the FBI received 800,944 cybercrime complaints.",
    "Losses exceeded $10.3 Billion in the U.S. alone.",
    "Cost of cybercrime is projected to reach $10.5 Trillion annually by 2025.",
    "More than 1 Billion Malware Programs Exist.",
    "Human Error Accounts for 95% of Cyber Attacks.",
    "Every 39 seconds there is a cyber attack.",
    "Email is the primary entry point of 94% of malware attacks.",
  ];

  async function searchProfile() {
    // ensure first and last name are not empty
    if (firstName.trim() === "" || lastName.trim() === "") {
      setHeading("Please fill out your first and last name.");
      return;
    }

    setProfiles([]);
    setLoading(true);
    setHeading(
      `Hi ${firstName}, we are currently searching for your profile...`
    );

    // Track when fetch request is completed to update progress bar
    let isFetchCompleted: boolean = false;

    // Fetch the profile, if it exists, from the server
    const fetchProfilePromise = fetch("https://api.erazer.io/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, userState }),
    })
      .then((response) => response.json())
      .then((data) => {
        isFetchCompleted = true;
        if (data.scrapedData.length === 0) {
          setHeading(
            `${firstName}... luckily for you, it looks like your profile doesn't exist on these data brokers.`
          );
        } else {
          setProfiles(data.scrapedData);
          setHeading("Click on your profile to initiate the removal");
        }
      })
      .catch((error) => console.error(error));

    // update progress bar
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const updateProgressBarPromise = (async () => {
      const totalDelayTime = 5000; // 5 seconds
      const delayTime = totalDelayTime / databrokers.length;
      for (let i = 0; i < databrokers.length; i++) {
        if (isFetchCompleted) {
          break;
        }
        await delay(delayTime);
        // Update progress and progressText for each data broker
        setProgress(((i + 1) / databrokers.length) * 97); // set max progress to 97%
        setProgressText(`${databrokers[i]}`);
      }
    })();

    await Promise.all([fetchProfilePromise, updateProgressBarPromise]);

    setLoading(false);
    setProgress(0);
    setProgressText("");
  }

  async function handleClick(profile_index: number) {
    setProfiles([]);
    setLoading(true);
    setHeading(
      `Thank you for your patience ${firstName}, we are working on removing your profile...`
    );

    // Track when fetch request is completed to update progress bar
    let isFetchCompleted: boolean = false;

    // Initiate the removal of the profile
    const removeProfilePromise = fetch("https://api.erazer.io/remove-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, userState, profile_index }),
    })
      .then((response) => response.json())
      .then((data) => {
        isFetchCompleted = true;
        setHeading(
          <div>
            {data.message} <br /> Please take a second and leave us some
            feedback{" "}
            <Link target="_blank" to="https://forms.gle/oJUddJyhV5oNgxXK7">
              <span className={styles.feedbackLink}>here.</span>
            </Link>
          </div>
        );
      })
      .catch((error) => console.error(error));

    // update progress bar
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const updateProgressBarPromise = (async () => {
      const totalDelayTime = 25000; // 25 seconds
      const delayTime = totalDelayTime / cybersecurityFacts.length;
      for (let i = 0; i < cybersecurityFacts.length; i++) {
        if (isFetchCompleted) {
          break;
        }
        await delay(delayTime);
        // Update progress and progressText for each data broker
        setProgress(((i + 1) / cybersecurityFacts.length) * 97); // set max progress to 97%
        setProgressFact(`${cybersecurityFacts[i]}`);
      }
    })();

    await Promise.all([removeProfilePromise, updateProgressBarPromise]);

    setLoading(false);
    setProgress(0);
    setProgressFact("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <Input
          autoComplete="off"
          autoFocus
          type="text"
          placeholder="First Name"
          onChange={(event) => setFirstName(event.target.value)}
          variant="flushed"
          className={styles.input}
        />
        <Input
          autoComplete="off"
          type="text"
          placeholder="Last Name"
          onChange={(event) => setLastName(event.target.value)}
          variant="flushed"
          className={styles.input}
        />
        <Select
          variant="flushed"
          placeholder="All States"
          color="white"
          onChange={(event) => setUserState(event.target.value)}
        >
          {states.map((state: string, index: number) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </Select>

        <Button
          style={{
            backgroundColor: "#6736f5",
            color: "white",
          }}
          width="200px"
          onClick={searchProfile}
          className={styles.searchButton}
        >
          Search
        </Button>
      </div>
      <h1 className={styles.heading}>{heading}</h1>
      <div className={styles.results}>
        {profiles.map((profile: string, index: number) => (
          <div
            key={index}
            className={styles.profile}
            onClick={() => handleClick(index)}
          >
            <p className={styles.info}>{profile}</p>
          </div>
        ))}
      </div>
      <div style={{ zIndex: 1 }}>
        {loading && (
          <ProgressBar
            progress={progress}
            progressText={progressText}
            progressFact={progressFact}
          />
        )}
      </div>
    </div>
  );
}
