import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import OfferingsCard from "@components/OfferingsCard";

function Home() {
  return (
    <div>
      <div className={styles.backgroundContainer}>
        <div className={styles.noiseBg}></div>
        <div className={styles.mainShape}></div>
      </div>
      <div className={styles.mainContainer}>
        <h1 className={styles.mainHeading}>
          Cybersecurity Designed for <br /> This Generation's Problems
        </h1>
        <p className={styles.tagLine}>
          Because getting your data sold isn’t cute
        </p>
        <Link to="/privateInvestigator" className={styles.getStartedButton}>
          Get Started
        </Link>

        <h1 className={styles.secondHeading}>
          Start protecting yourself with{" "}
          <span className={styles.secondHeadingColor}>Erazer</span>
        </h1>
        <div className={styles.offeringsContainer}>
          <OfferingsCard
            product="Data Broker Removal"
            description="Delete your personal data from 200+ data broker services."
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
    </div>
  );
}

export default Home;
