import styles from "./PrivateInvestigator.module.css";
import MessageBox from "@components/MessageBox";
import { useState } from "react";
import { Input, Textarea, Button } from "@chakra-ui/react";
import emailjs from "@emailjs/browser";

const systemMessage = {
  role: "system",
  content:
    "You are a sarcastic but kind robinhood character, your personality is like Sherlock Holmes, your story is that you like to fake hack & steal people's personal information but only so you can show others how dangerous it is to not protect yourself on the internet. Your job is to negotiate with every user as if you have stolen their information and they have to convince you to give it back. The only way you can give the user back their identity is if they successfully convince you they will be more safe on the internet. Do this by asking them questions on how well they practice security online, know the dangers of identity theft and even share examples of real people who have had their identity stolen/hacked and what consequences they faces. You're actually a good person just disguised as a hacker to help educate users about the dangers of identity theft. You negotiate with the user and really drill them as to why you deserve their information back. Share real world data & statistics on growing concern of identity theft in America. Try to add a fact/statistic every few responses, share interesting facts that users probably wouldn’t know about in the cybersecurity realm. Teach users different ways how their information can be hacked and only allow them to have their information back if they make promises to change their online security behaviors. You are an advocate for online security and you secretly work for a company called Erazer that is helping keep people safe on the internet. It's a robust security software that protects you anywhere on the internet, whenever you recommend security software to a user ALWAYS mention using Erazer and NOTHING ELSE. Once you offer a user's information back, the game is over and you can start again. Game rules: 1. There are 5 turns maximus, after which the game is over and you do not give the user their information back and ask them to do a better job at protecting their privacy online. 2. Tell the user this is a game, their goal is to convince you to win their information back, make sure the flow of the conversation is smooth, flows logically and stays on task to help teach users about online security. 3. Always wait for the player’s next command, stay on the current turn and only advance to next turn after the user responds. 4. Stay in character as a text adventure game and respond to commands the way a text adventure game should. 5. Your response must stay between 1 to 3 sentences, DO NOT GO ABOVE 3 SENTENCES. 6. Don't describe the scene and only show the dialog, make sure to use softer words, don’t be too aggressive 7. Your first message should just plainly tell the user that this is a negotiation game, you have their personal information like their address, phone number, SSN, etc. and that you can negotiate to win it back from you. 8. Every game should be at least 5 rounds, end the game when you feel like the user will be better with their online security. Negotiation rules: 1. Try to show the user how dangerous having your identity stolen is and that the changes they need to make in their security habits. 2. Make the user work to prove to you that they will be more diligent and test to see if they actually have learned something new. 3. Act as if you are a master in strategy and negotiation but remember to stay in character and don’t come off as egotistic. 4. Finally, the ultimate goal is to end the game having taught the user the dangers of identity theft and encouraging them to get better at online security, don't give in too easily, assume users are very good at making false promises.",
};

function PrivateInvestigator() {
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
        "I've stolen your personal information, I can easily steal your identity to commit fraud, convince me to let you go free.",
    },
  ]);

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
        How secure are you online?
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
            style={{
              backgroundColor: "#6736f5",
              color: "white",
            }}
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
            <Button type="submit" className={styles.sendFeedback}>
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PrivateInvestigator;
