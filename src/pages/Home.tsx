import styles from "./Home.module.css";
import OfferingsCard from "@components/OfferingsCard";
import ProfileRemoval from "@components/ProfileRemoval";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainHeading}>
        Remove your personal information <br /> from 16 data brokers
      </h1>
      <p className={styles.tagLine}>
        Because getting your data sold isn’t cute
      </p>

      <ProfileRemoval />

      <h1 className={styles.secondHeading}>
        Start protecting yourself with{" "}
        <span className={styles.secondHeadingColor}>Erazer</span>
      </h1>
      <div className={styles.offeringsContainer}>
        <OfferingsCard
          product="Data Broker Removal"
          description="Delete your personal data from 16 data broker services."
        />
        <OfferingsCard
          product="Dark Web (coming soon)"
          description="Monitor & support to remove any leaked personal information from the dark web."
        />
        <OfferingsCard
          product="Image Piracy (coming soon)"
          description="Remove your images from unwanted places on the internet."
        />
      </div>
    </div>
  );
}

export default Home;
