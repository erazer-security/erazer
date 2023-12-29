import styles from "./ProfileRemoval.module.css";
import { useState, useRef } from "react";
import { Input, Select } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { SwiperNavButtons } from "@components/SwiperNavButton";
import "swiper/css";
import "swiper/css/pagination";
import ProgressBar from "@components/ProgressBar";
import { Profile } from "@components/types";
import googleLogo from "/googleLogo.png";
import { allDatabrokers } from "@components/databrokers";

export default function ProfileRemoval() {
  const swiperRef = useRef<any>(null); // reference to swiper instance
  const [heading, setHeading] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userState, setUserState] = useState<string>("All States");
  const [userCity, setUserCity] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [locations, setLocations] = useState<string[]>([]);
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

  async function searchProfile() {
    // ensure first and last name and age are not empty
    if (firstName.trim() === "" || lastName.trim() === "" || age === 0) {
      setHeading("Please fill out your first and last name and age.");
      return;
    }

    setUserCity("");
    setLocations([]);
    setFilteredProfiles([]);
    setSelectedProfiles([]);
    setLoading(true);
    setRemovalReady(false);
    setHeading(
      `Hi ${firstName}, we are currently searching for your profile...`
    );

    // Track when fetch request is completed to update progress bar
    let isFetchCompleted: boolean = false;

    // Fetch the profile, if it exists, from the server
    const fetchProfilesPromise = fetch(
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? "http://localhost:5002/profiles"
        : "https://api.erazer.io/profiles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          userState: userState,
          age: age,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        isFetchCompleted = true; // all fetch requests are completed
        if (data.profiles.length === 0) {
          setHeading(
            `${firstName}... luckily for you, it looks like your profile doesn't exist on these data brokers.`
          );
        } else {
          const profilesFiltered = data.profiles.filter(
            (profile: Profile) => profile.age == age || profile.age == 0 // get profiles with matching ages or no ages shown (could be user)
          );

          if (profilesFiltered.length === 0) {
            setHeading(
              `${firstName}... it looks like your profile doesn't exist on these data brokers.`
            );
          } else {
            setFilteredProfiles(profilesFiltered);
            // setLocations to profilesFiltered's locations.  Use Set to remove duplicates
            setLocations(
              Array.from(
                new Set(
                  profilesFiltered
                    .map((profile: Profile) => profile.locations)
                    .flat()
                )
              )
            );

            if (profilesFiltered.length === 1) {
              setHeading(
                "We found 1 profile. If this is you, click on it to begin removal."
              );
              setRemovalReady(true); // since this is the only profile available, enable removal button
            } else if (profilesFiltered.length > 10) {
              setHeading(
                `We found ${profilesFiltered.length} profiles.  This may be a lot of profiles to go through. If you’d like, you can provide your city to narrow down the results. Or you can simply just go through all of them.`
              );
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
      const totalDelayTime = 40000; // 40 seconds
      const delayTime = totalDelayTime / allDatabrokers.length;
      for (let i = 0; i < allDatabrokers.length; i++) {
        if (isFetchCompleted) {
          break;
        }
        await delay(delayTime);
        // Update progress and progressText for each data broker
        setProgress(((i + 1) / allDatabrokers.length) * 97); // set max progress to 97%
        setProgressText(`${allDatabrokers[i]}`);
      }
    })();

    await Promise.all([fetchProfilesPromise, updateProgressBarPromise]);

    setLoading(false);
    // reset progress bar
    setProgress(0);
    setProgressText("");
  }

  async function narrowProfiles() {
    if (userCity.trim() === "") {
      setHeading("Please enter your city.");
      return;
    }

    // only keep profiles that include the user's city
    const profilesFiltered = filteredProfiles.filter((profile: Profile) =>
      // check if any of the profile's locations include the user's city
      // if the profile.website is usa-official.com, then check if the profile.profile includes the user's city (this is because usa-official.com have very non static ways of displaying locations)
      profile.website === "usa-official.com"
        ? profile.profile.toLowerCase().includes(userCity.toLowerCase())
        : profile.locations.some((location: string) =>
            location.toLowerCase().includes(userCity.toLowerCase())
          )
    );

    setFilteredProfiles(profilesFiltered);

    if (profilesFiltered.length === 0) {
      setHeading("It looks like your city doesn't match any of the profiles.");
      return;
    } else {
      setHeading("These are the profiles that match your city.");
      if (profilesFiltered.length === 1) {
        setRemovalReady(true); // since this is the only profile available, enable removal button
      }
      // reset the index of swiper slides to 0
      if (swiperRef.current) {
        swiperRef.current.swiper.slideTo(0);
      }
    }
  }

  function navigateResults() {
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

    setRemovalReady(false); // disable removal button

    // set necessary removal information in session and navigate to sign in page
    sessionStorage.setItem("firstName", firstName);
    sessionStorage.setItem("lastName", lastName);
    sessionStorage.setItem("userState", userState);
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
          onChange={(event) => setFirstName(event.target.value)}
          variant="flushed"
          style={{ borderBottom: "2px solid #c7b8e7" }}
          className={styles.input}
        />
        <Input
          autoComplete="off"
          type="text"
          placeholder="Last Name"
          onChange={(event) => setLastName(event.target.value)}
          variant="flushed"
          style={{ borderBottom: "2px solid #c7b8e7" }}
          className={styles.input}
        />
        <Input
          autoComplete="off"
          type="number"
          placeholder="Age"
          onChange={(event) => setAge(parseInt(event.target.value))}
          variant="flushed"
          style={{ borderBottom: "2px solid #c7b8e7" }}
          className={styles.input}
        ></Input>
        <Select
          variant="flushed"
          placeholder="All States"
          color="white"
          style={{ fontWeight: "600", borderBottom: "2px solid #c7b8e7" }}
          onChange={(event) => setUserState(event.target.value)}
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

      {filteredProfiles.length > 10 && (
        <div className={styles.inputContainer}>
          <Input
            list="locations"
            autoComplete="new-password" // disable broswers from autofilling user location
            type="text"
            placeholder="City"
            onChange={(event) => setUserCity(event.target.value)}
            variant="flushed"
            style={{ borderBottom: "2px solid #c7b8e7" }}
            className={styles.input}
          />
          {userCity.trim() !== "" && (
            <datalist id="locations">
              {locations
                .filter((location: string) =>
                  location.toLowerCase().includes(userCity.toLowerCase())
                )
                .slice(0, 10)
                .map((location: string, index: number) => (
                  <option key={index} value={location} />
                ))}
            </datalist>
          )}
          <button onClick={narrowProfiles} className={styles.searchButton}>
            Confirm
          </button>
        </div>
      )}

      <Swiper
        ref={swiperRef}
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
              <p className={styles.profileIndex}>
                {index + 1}/{filteredProfiles.length}
              </p>
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
