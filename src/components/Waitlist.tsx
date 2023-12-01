import styles from "./Waitlist.module.css";
import { useState } from "react";
import { Input } from "@chakra-ui/react";
import emailjs from "@emailjs/browser";

export default function Waitlist() {
  const [email, setEmail] = useState<string>("");

  function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim() === "") return;

    emailjs.sendForm(
      `${import.meta.env.VITE_EMAILJS_SERVICE_ID}`,
      `${import.meta.env.VITE_EMAILJS_WAITLIST_TEMPLATE_ID}`,
      event.target as HTMLFormElement,
      `${import.meta.env.VITE_EMAILJS_API_KEY}`
    );

    setEmail("");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Join our <span className={styles.headingColor}>waitlist</span>
      </h1>
      <p className={styles.tagLine}>For Dark Web Removal and Image Takedown</p>
      <form onSubmit={handleSignup} className={styles.inputContainer}>
        <Input
          autoComplete="off"
          type="email"
          name="from_email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          variant="flushed"
          style={{ borderBottom: "2px solid #c7b8e7" }}
          className={styles.input}
        ></Input>
        <button type="submit" className={styles.signUpButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
