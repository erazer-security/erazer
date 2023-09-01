import styles from "./Feedback.module.css";
import {
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  CloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import MessageBox from "@components/MessageBox";

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to Erazer! We value your opinion and would love to hear about your experience. Your feedback helps us improve and provide you with a better service. Whether you have suggestions, compliments, or areas where we can enhance, please take a moment to share your thoughts with us. Thank you for visiting, and for helping us serve you better!",
    },
  ]);

  function sendFeedback(event: any) {
    event.preventDefault();
    if (name !== "" && email !== "" && feedback !== "") {
      emailjs.sendForm(
        `${import.meta.env.VITE_EMAILJS_SERVICE_ID}`,
        `${import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID}`,
        event.target,
        `${import.meta.env.VITE_EMAILJS_API_KEY}`
      );
      setName("");
      setEmail("");
      setFeedback("");
      setSent(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: feedback },
      ]);
      // wait for 1 second before sending the assistant message
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content:
              "Thank you so much for your feedback! We truly value your opinion and will use your feedback to improve our service.",
          },
        ]);
      }, 1000);
    } else {
      setNotFilled(true);
    }
  }

  function onClose() {
    setSent(false);
    setNotFilled(false);
  }

  return (
    <div className={styles.container}>
      {notFilled && (
        <div>
          <Alert status="error">
            <AlertIcon />
            Please fill out all fields.
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={onClose}
            />
          </Alert>
        </div>
      )}
      <MessageBox messages={messages} loading={false}></MessageBox>
      {!sent && (
        <div className={styles.inputContainer}>
          <form onSubmit={sendFeedback} className={styles.feedbackForm}>
            <Input
              autoComplete="off"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              name="from_name"
              variant="flushed"
              className={styles.input}
            />
            <Input
              autoComplete="off"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              name="from_email"
              variant="flushed"
              className={styles.input}
            />
            <Textarea
              placeholder="Feedback"
              name="message"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              variant="flushed"
              className={styles.feedback}
            />
            <Button
              colorScheme="blue"
              type="submit"
              className={styles.sendMessage}
            >
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
