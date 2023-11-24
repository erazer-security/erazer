import styles from "./Home.module.css";
import OfferingsCard from "@components/OfferingsCard";
import ProfileRemoval from "@components/ProfileRemoval";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainHeading}>
      Find out what personal information <br /> is available about you online
      </h1>
      <p className={styles.tagLine}>
        Remove yourself from 30 data brokers websites that buy & sell your data
      </p>

      <ProfileRemoval />

      <h1 className={styles.secondHeading}>
        Start protecting yourself with{" "}
        <span className={styles.secondHeadingColor}>Erazer</span>
      </h1>
      <div className={styles.offeringsContainer}>
        <OfferingsCard
          product="Data Broker Removal"
          description="Delete your personal data from 30 data broker services."
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
