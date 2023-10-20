import styles from "./ProfileRemoval.module.css";
import { TailSpin } from "react-loader-spinner";
import { Input, Select, Button } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProfileRemoval() {
  const [heading, setHeading] = useState<string | JSX.Element>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userState, setUserState] = useState<string>("All States");
  const [profiles, setProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

    // Fetch the profile, if it exists, from the server
    await fetch("https://api.erazer.io/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, userState }),
    })
      .then((response) => response.json())
      .then((data) => {
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

    setLoading(false);
  }

  async function handleClick(profile_index: number) {
    setProfiles([]);
    setLoading(true);
    setHeading(
      `Thank you for your patience ${firstName}, we are working on removing your profile...`
    );

    // Initiate the removal of the profile
    await fetch("https://api.erazer.io/remove-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, userState, profile_index }),
    })
      .then((response) => response.json())
      .then((data) => {
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

    setLoading(false);
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
          <TailSpin
            height="50"
            width="50"
            color="#6736f5"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        )}
      </div>
    </div>
  );
}
