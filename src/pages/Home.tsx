import styles from "./Home.module.css";
import { HashLink } from "react-router-hash-link";
import ProfileSearch from "@components/ProfileSearch";
import HallOfHorror from "@pages/HallOfHorror";
import Waitlist from "@components/Waitlist";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainHeading}>
        Skirt The Stalkers <br /> See What The Internet Knows About You
      </h1>
      <p className={styles.tagLine}>
        Remove your personal information from 74 data brokers
      </p>

      <section id="profileSearch">
        <ProfileSearch />
      </section>
      <section id="waitlist">
        <Waitlist />
      </section>
      <section id="hallOfHorror">
        <HallOfHorror />
      </section>
      <HashLink to="/privacypolicy" className={styles.privacyPolicyLink}>
        Privacy Policy
      </HashLink>
    </div>
  );
}

export default Home;
