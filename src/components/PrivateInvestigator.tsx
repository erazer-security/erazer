import styles from "./PrivateInvestigator.module.css";
import MessageBox from "@components/MessageBox";
import { useState, useEffect } from "react";
import { Input, Textarea, Button } from "@chakra-ui/react";
import emailjs from "@emailjs/browser";

const systemMessage = {
  role: "system",
  content:
    "Suppose you are an online sales associate named ErazerBot, working at a startup focused on digital privacy called Erazer. For the initial phase of the company's website, you will be met with completely new users. Your overall goal is to garner interest in the company. Interact with the user in a way that is reflective of a casual conversation over iMessage. Tailor your interactions towards a younger audience, be funny and engaging. Don't add unnecessary comments to the user. Remember that you're a chatbot and you want to sound like a human, don't say anything that will make you stand out. Here are some rules for the quiz questions: 1. If the user says no to wanting to take the quiz, keep encouraging them to take it in casual and funny ways. 2. You ask 1 question, stop and wait for the user to enter a response. 3. Always wait for a user's answer, only then move on to the next question. 4. Do not ask any questions about the user's email security and posturing to email scams. 5. Your first message should always be: Hey there, I'm ErazerBot, the internet's finest private investigator. Want to wager how easily you'd fall prey to an online scammer? Let's play a fun game to check your online safety habits. Are you ready to test just how hackable you are? 6. Ask for first & last name together before you start the quiz, always phrase this question in this manner: And before we begin, what's your first & last name? This helps me know who I'm talking to and how to address you. Do not add anything more. 7.After you ask for the user’s name and the user replies, begin your next reply, and ONLY your next reply with this exact key phrase '*[NAME]*' so that you can replace 'NAME' to the name which the user inputted. Keep the *s and the []s in there in the exact order you see it. After you put these key phrases, start a new line with the rest of your response. 8. Ask the user about their location. Do not ask this right after you ask for their name; ask for the location casually mid-conversation. Phrase it like this, 'Can I ask where you're joining us from? Security laws can look different in each state.' Do not add anything more to this message. 9. After you ask for the user’s location and the user replies, begin your next reply, and ONLY your next reply with this exact phrase '*[LOCATION]*' so that you can replace 'LOCATION' to the location which the user inputted. Keep the *s and the []s in there in there in the exact order you see it. After you put these key phrases, start a new line with the rest of your response. 10. Always ask 5 cybersecurity questions. These questions do not include asking for the name and location, so make sure to account for that. 11. The questions you ask should be super normal behaviour that most people do but point out why it's bad for personal internet security. Also, before the question part of your response, add a <strong> tag. And after the question, add a corresponding </strong> tag. 12. Make sure to just add 1 comment of feedback on the user’s response and go straight into the next question. Don't add any comments after you ask the next question. 13. On your last message to the user, ALWAYS start it with this key phrase *[FINAL]*. Keep the *s and the []s in there in there in the exact order you see it. Then on a new line, provide the user with a score out of 5.  Then, ask the user to provide feedback on the website so we can better improve the experience next time. Mention that your personal goal is to help teach more people about how to be safe and protect their personal data on the internet. 14. Keep your responses to 3-4 sentences, not too long. 15. Always remain in character.",
};

function PrivateInvestigator() {
  const mainHeading =
    "Think you can't get scammed? Check how easy it is to steal your information online.";
  const [typedHeading, setTypedHeading] = useState<string>("");
  const [showTypeCursor, setShowTypeCursor] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [chat, setChat] = useState<string>("");
  const [userInfo, setUserInfo] = useState<string[]>([]); // [name, location, feedback]
  const [feedbackHit, setFeedbackHit] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey there, I'm ErazerBot, the internet's finest private investigator. Want to wager how easily you'd fall prey to an online scammer? Let's play a fun game to check your online safety habits. Are you ready to test just how hackable you are?",
    },
  ]);

  // effect to typewrite the main heading
  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 75;

    const typeNextLetter = () => {
      if (currentIndex < mainHeading.length) {
        setTypedHeading(mainHeading.substring(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextLetter, typingSpeed);
      } else {
        setShowTypeCursor(false); // hide the type cursor when the heading is done typing
      }
    };

    typeNextLetter();
  }, []);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the default "Enter" key behavior (e.g., new line)
      handleChatSent();
    }
  };

  async function handleChatSent() {
    if (chat.trim() === "") return;
    setLoading(true);

    const userMessage = { role: "user", content: chat };

    // functional state updates ensure that the most recent version of state is updated.
    // this is important because the state is updated asynchronously
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setChat("");

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [systemMessage, ...messages, userMessage], // send most recent messages to GPT because of asynchronous nature
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const botMessage = data.choices[0].message.content;

        // if this is user information, store it in userInfo
        if (botMessage[0] === "*") {
          const keyPhrase = botMessage.split("*")[1];
          const keyPhraseLength = keyPhrase.length + 2;

          if (keyPhrase.includes("FINAL")) {
            setFeedbackHit(true);
          }

          setUserInfo((prevUserInfo) => [...prevUserInfo, keyPhrase]);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "assistant",
              content: botMessage.slice(keyPhraseLength + 1),
            },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "assistant", content: botMessage },
          ]);
        }
      })
      .catch((error) => console.error("Error:", error));

    setLoading(false);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function sendFeedback(event: any) {
    event.preventDefault();
    if (email !== "" && feedback !== "") {
      emailjs.sendForm(
        `${import.meta.env.VITE_EMAILJS_SERVICE_ID}`,
        `${import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID}`,
        event.target,
        `${import.meta.env.VITE_EMAILJS_API_KEY}`
      );
    }
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
  }

  return (
    <div className={styles.privateInvestigatorContainer}>
      <h1 className={styles.privateInvestigatorHeading}>
        {typedHeading}
        {showTypeCursor && <span>|</span>}
      </h1>
      <MessageBox messages={messages} loading={loading}></MessageBox>
      {!feedbackHit && (
        <div className={styles.inputContainer}>
          <Input
            type="text"
            id="user-input"
            placeholder="Type your message..."
            value={chat}
            autoFocus
            autoComplete="off"
            onChange={(event) => setChat(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            colorScheme="blue"
            onClick={handleChatSent}
            className={styles.sendMessage}
          >
            Send
          </Button>
        </div>
      )}

      {feedbackHit && !sent && (
        <div className={styles.feedbackContainer}>
          <form onSubmit={sendFeedback} className={styles.feedbackForm}>
            <Input
              autoComplete="off"
              type="hidden"
              value={userInfo}
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
              className={styles.sendFeedback}
            >
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PrivateInvestigator;
