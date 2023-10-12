import { TailSpin } from "react-loader-spinner";
import { Input, Select, Button } from "@chakra-ui/react";
import styles from "./Product.module.css";
import { useState } from "react";

export default function Product() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userState, setUserState] = useState("All States");
  const [profiles, setProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const states = [
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
    setProfiles([]);
    setLoading(true);

    // Fetch scraped data from the server
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
          setProfiles(["No profiles found."]);
        } else {
          setProfiles(data.scrapedData);
        }
      })
      .catch((error) => console.error(error));

    setLoading(false);
  }

  async function handleClick(profile_index: any) {
    setProfiles([]);
    setLoading(true);

    // Fetch scraped data from the server
    await fetch("https://api.erazer.io/remove-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, userState, profile_index }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // setProfiles(data.scrapedData);
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
          {states.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </Select>

        <Button
          style={{
            backgroundColor: "#6736f5",
            color: "white",
            marginLeft: "10px",
          }}
          width="150px"
          onClick={searchProfile}
          className={styles.button}
        >
          Search
        </Button>
      </div>
      <div className={styles.results}>
        {profiles.map((profile, index) => (
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
