import styles from "./ProfileRemoval.module.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProfiles } from "@redux/profiles";
import { setFirstName, setLastName, setUserState, setAge } from "@redux/user";
import { Input, Select } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { SwiperNavButtons } from "@components/SwiperNavButton";
import "swiper/css";
import "swiper/css/pagination";
import ProgressBar from "@components/ProgressBar";
import { Profile } from "@components/types";
import googleLogo from "/googleLogo.png";

export default function ProfileRemoval() {
  const dispatch = useDispatch();

  const [heading, setHeading] = useState<string>("");
  const { user } = useSelector((state: any) => state.user);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]); // profiles filtered by age
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]); // profiles selected for removal
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>("");
  const [removalReady, setRemovalReady] = useState<boolean>(false);

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
    "peoplewhizr.net",
    "truthrecord.org",
    "privatereports.org",
    "personsearchers.com",
    "peoplewizard.com",
    "backgroundcheckers.net",
    "checksecrets.com",
    "inmatesearcher.com",
    "peoplewhized.com",
    "mugshotlook.com",
    "peopleswiz.com",
    "peoplesearch123.com",
    "peopleswhizr.com",
    "people-wizard.com",
    "peoplesearcher.com",
    "peoplesearchusa.org",
    "peoplewizard.net",
    "personsearcher.com",
    "privaterecords.net",
    "publicsearcher.com",
    "peoplewhiz.com",
    "sealedrecords.net",
    "secretinfo.org",
    "peoplewizr.com",
  ];

  async function searchProfile() {
    // ensure first and last name and age are not empty
    if (
      user.firstName.trim() === "" ||
      user.lastName.trim() === "" ||
      user.age === 0
    ) {
      setHeading("Please fill out your first and last name and age.");
      return;
    }

    dispatch(setProfiles([]));
    setFilteredProfiles([]);
    setSelectedProfiles([]);
    setLoading(true);
    setRemovalReady(false);
    setHeading(
      `Hi ${user.firstName}, we are currently searching for your profile...`
    );

    // Track when fetch request is completed to update progress bar
    let isFetchCompleted: boolean = false;

    // Fetch the profile, if it exists, from the server
    const fetchProfilePromise = fetch(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "http://localhost:5002/profiles"
        : "https://api.erazer.io/profiles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          userState: user.userState,
          age: user.age,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        isFetchCompleted = true; // request is completed
        if (data.scrapedData.length === 0) {
          setHeading(
            `${user.firstName}... luckily for you, it looks like your profile doesn't exist on these data brokers.`
          );
        } else {
          dispatch(setProfiles(data.scrapedData));

          const profilesFiltered = data.scrapedData.filter(
            (profile: Profile) => profile.age == user.age || profile.age == 0 // get profiles with matching ages or no ages shown (could be user)
          );

          if (profilesFiltered.length === 0) {
            setHeading(
              `${user.firstName}... it looks like your profile doesn't exist on these data brokers.`
            );
          } else {
            setFilteredProfiles(profilesFiltered);

            if (profilesFiltered.length === 1) {
              setHeading(
                "We found 1 profile. If this is you, click on it to begin removal."
              );
              setRemovalReady(true); // since this is the only profile available, enable removal button
            } else {
              setHeading(
                `We found ${profilesFiltered.length} profiles. Let's narrow it down by selecting those that match you.`
              );
            }
          }
        }
      })
      .catch((error) => console.error(error));

    // update progress bar
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const updateProgressBarPromise = (async () => {
      const totalDelayTime = 10000; // 10 seconds
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
    // reset progress bar
    setProgress(0);
    setProgressText("");
  }

  function navigateResults() {
    // ensure at least one profile is selected
    if (selectedProfiles.length === 0) {
      setHeading("You must select at least one profile to begin removal.");
      return;
    }

    // for all selected profiles, add a field to the object called "status" and set it to "In Progress"
    const selectedProfilesWithStatus = selectedProfiles.map(
      (profile: Profile) => ({
        ...profile,
        status: "In Progress",
        // status: "Pending",
      })
    );

    setRemovalReady(false); // disable removal button

    // set necessary removal information in session and navigate to sign in page
    sessionStorage.setItem("firstName", user.firstName);
    sessionStorage.setItem("lastName", user.lastName);
    sessionStorage.setItem("userState", user.userState);
    sessionStorage.setItem(
      "selectedProfiles",
      JSON.stringify(selectedProfilesWithStatus)
    );

    window.location.href =
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "http://localhost:5001/auth/google"
        : "https://authentication.erazer.io/auth/google";
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

  const handleSlideChange = (swiper: any) => {
    // ensure user goes through all profiles before enabling removal button
    if (swiper.activeIndex === filteredProfiles.length - 1) {
      setRemovalReady(true); // enable removal button
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <Input
          autoComplete="off"
          autoFocus
          type="text"
          placeholder="First Name"
          onChange={(event) => dispatch(setFirstName(event.target.value))}
          variant="flushed"
          style={{ borderBottom: "2px solid #c7b8e7" }}
          className={styles.input}
        />
        <Input
          autoComplete="off"
          type="text"
          placeholder="Last Name"
          onChange={(event) => dispatch(setLastName(event.target.value))}
          variant="flushed"
          style={{ borderBottom: "2px solid #c7b8e7" }}
          className={styles.input}
        />
        <Input
          autoComplete="off"
          type="number"
          placeholder="Age"
          onChange={(event) => dispatch(setAge(parseInt(event.target.value)))}
          variant="flushed"
          style={{ borderBottom: "2px solid #c7b8e7" }}
          className={styles.input}
        ></Input>
        <Select
          variant="flushed"
          placeholder="All States"
          color="white"
          style={{ fontWeight: "600", borderBottom: "2px solid #c7b8e7" }}
          onChange={(event) => dispatch(setUserState(event.target.value))}
        >
          {states.map((state: string, index: number) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </Select>
        <button onClick={searchProfile} className={styles.searchButton}>
          Search
        </button>
      </div>
      <h1 className={styles.heading}>{heading}</h1>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        onSlideChange={handleSlideChange}
        className={styles.profilesCarousel}
      >
        {filteredProfiles.map((profile: Profile, index: number) => (
          <SwiperSlide key={index}>
            <div
              key={index}
              className={styles.profile}
              style={{
                backgroundColor: selectedProfiles.includes(profile)
                  ? "#100424"
                  : "",
              }}
            >
              <p className={styles.profileInfo}>{profile.profile}</p>
            </div>
            <SwiperNavButtons
              onNotMeClick={() => handleProfileRemove(profile)}
              onThisIsMeClick={() => handleProfileAdd(profile)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {removalReady && (
        <button onClick={navigateResults} className={styles.loginGoogleButton}>
          <img src={googleLogo} className={styles.googleLogo}></img>
          SIGN IN WITH GOOGLE TO BEGIN REMOVAL
        </button>
      )}
      <div style={{ zIndex: 1 }}>
        {loading && (
          <ProgressBar progress={progress} progressText={progressText} />
        )}
      </div>
    </div>
  );
}
