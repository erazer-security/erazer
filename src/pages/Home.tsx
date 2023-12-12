import styles from "./Home.module.css";
import { HashLink } from "react-router-hash-link";
import ProfileRemoval from "@components/ProfileRemoval";
import WallOfHorror from "@pages/WallOfHorror";
import PrivateInvestigator from "@components/PrivateInvestigator";
import Waitlist from "@components/Waitlist";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainHeading}>
        Skirt The Stalkers <br /> See What The Internet Knows About You
      </h1>
      <p className={styles.tagLine}>
        Remove your personal information from 30 data brokers
      </p>

      <section id="profileRemoval">
        <ProfileRemoval />
      </section>
      <section id="waitlist">
        <Waitlist />
      </section>
      <section id="wallOfHorror">
        <WallOfHorror />
      </section>
      <section id="privateInvestigator">
        <PrivateInvestigator />
      </section>
      <HashLink to="/privacypolicy" className={styles.privacyPolicyLink}>
        Privacy Policy
      </HashLink>
    </div>
  );
}

export default Home;
