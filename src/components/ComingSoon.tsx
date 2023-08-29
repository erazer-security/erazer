import styles from "./ComingSoon.module.css";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Input, Button } from "@chakra-ui/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ComingSoon() {
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "This page is coming soon! In the meantime, enter your email to sign up to our mailing list to be kept updated on when we release this product!",
    },
  ]);

  function handleChatSent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (chat.trim() === "") return;

    emailjs.sendForm(
      `${import.meta.env.VITE_EMAILJS_SERVICE_ID}`,
      `${import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID}`,
      event.target as HTMLFormElement,
      `${import.meta.env.VITE_EMAILJS_API_KEY}`
    );

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: chat },
    ]);

    setChat("");

    // wait for 1 second before sending the assistant message
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            "Thank you for your interest! We'll be sure to let you know when this page is ready!",
        },
      ]);
    }, 1000);
  }

  return (
    <div className={styles.container}>
      <div className={styles.messagesContainer}>
        {messages.map((message) => {
          if (message.role === "assistant") {
            return <p className={styles.assistantMessage}>{message.content}</p>;
          } else {
            return <p className={styles.userMessage}>{message.content}</p>;
          }
        })}
      </div>
      <div className={styles.inputContainer}>
        <form onSubmit={handleChatSent} className={styles.emailForm}>
          <Input
            type="email"
            name="from_email"
            placeholder="Type in your email..."
            value={chat}
            autoFocus
            autoComplete="off"
            onChange={(event) => setChat(event.target.value)}
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
    </div>
  );
}
