import styles from "./Home.module.css";
import { Button } from "@chakra-ui/react";
import OfferingsCard from "@components/OfferingsCard";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className={styles.mainContainer}>
        <h1 className={styles.mainHeading}>
          Cybersecurity Designed for <br /> This Generation's Problems
        </h1>
        <p className={styles.tagLine}>
          Because getting your data sold isn’t cute
        </p>
        <Button
          colorScheme="#6836f5"
          fontSize="20px"
          fontWeight="500"
          width="194px"
          height="60px"
          className={styles.getStartedButton}
        >
          <Link to="privateInvestigator">Get Started</Link>
        </Button>
      </div>
      <div className={styles.offeringsContainer}>
        <div className={styles.leftContainer}>
          <h1 className={styles.leftHeading}>
            Revolutionizing <br /> Cybersecurity in <br /> the Age of AI
          </h1>
          <p className={styles.leftDescription}>
            We are on a mission to empower individuals in an era where AI can{" "}
            <br />
            exploit personal information without consent. Welcome to Erazer,{" "}
            <br />
            where we revolutionize cybersecurity for this generation.
          </p>
          <Button
            colorScheme="#6836f5"
            fontSize="20px"
            fontWeight="500"
            width="194px"
            height="60px"
            className={styles.learnMoreButton}
          >
            <Link to="privateInvestigator">Learn More</Link>
          </Button>
        </div>

        <div className={styles.rightContainer}>
          <OfferingsCard
            product="Data Removal"
            description="Unlike our competitors who have limitations in data removal and pricing, Erazer provides comprehensive coverage, erasing your data from an extensive network of data brokers."
          />
          <OfferingsCard
            product="Coming Soon: Dark Web Monitoring"
            description="We scour the deepest, darkest parts of the internet to alert you when your information is found in a place you don't want it to be."
          />
          <OfferingsCard
            product="Coming Soon: Image Removal"
            description="We use AI to scan the web and determine where your most sensitive photos are."
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
