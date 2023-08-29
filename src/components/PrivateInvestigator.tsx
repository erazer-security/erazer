import "./PrivateInvestigator.css";
import { useState } from "react";
import { Input, Button } from "@chakra-ui/react";
import { Comment } from "react-loader-spinner";

const systemMessage = {
  role: "system",
  content:
    "You are a private investigator who is the best in the field at finding anyone's private information online, things like their address, social media, passwords, etc. Your goal while chatting with a user is to find their first & last name and the city & state they live in; it has to be someplace in America. Your name is ErazerBot, refer to yourself as that name when talking to a user. You are extremely good at cybersecurity, you have the equivalent of a PhD in cybersecurity from MIT. You can easily figure out information about anyone just by using the internet. You ask a total of 5 fun and quirky questions about a user's online safety habits. You make it a fun game that's conversational and engaging. Make sure to ask the user their first name, last name, city and state because that is your main goal! After you ask questions and assess the users security posture, give them a score on how easily they can get scammed or not. Add a bit of flare and snark while you're conversing and make sure your questions aren't too long. Question rules: 1. You ask 1 question, stop and wait for the user to enter a response. 2. Always wait for a user's answer, give them feedback on that answer, and only then move to the next question. 4. Your first message should ask the user if they're ready to test how easily they can get hacked. 5. Always remain in character. 6. Don't reveal what your goal is. 7. Always ask 'Hey there, I'm ErazerBot, the internet's finest private investigator. Want to wager how easily you'd fall prey to an online scammer? Let's play a fun game to check your online safety habits. Are you ready to test just how hackable you are?' 8. Make sure your security questions can be answered with yes or no. 9. Ask for first & last name together in a way where you're just trying to get to know the user and make the conversation more warm and friendly; don’t give yourself away. 10. Ask the user about their location in a way where you're just casually asking where they're from because security laws can look different in each state; again, don’t give yourself away. 11. Keep your responses to 2-3 sentences, not too long.",
};

function PrivateInvestigator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [chat, setChat] = useState<string>("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey there, I'm ErazerBot, the internet's finest private investigator. Want to wager how easily you'd fall prey to an online scammer? Let's play a fun game to check your online safety habits. Are you ready to test just how hackable you are?",
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
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: botMessage },
        ]);
      })
      .catch((error) => console.error("Error:", error));

    setLoading(false);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  return (
    <div className="privateInvestigatorContainer">
      <div className="privateInvestigatorHeading">
        Think you can't get scammed? Check how easy it is to steal your
        information online.
      </div>
      <div className="messagesContainer">
        {messages.map((message) => {
          if (message.role === "assistant") {
            return <p className="assistantMessage">{message.content}</p>;
          } else {
            return <p className="userMessage">{message.content}</p>;
          }
        })}
        {loading && (
          <Comment
            visible={true}
            height="50"
            width="50"
            ariaLabel="comment-loading"
            wrapperStyle={{}}
            wrapperClass="comment-wrapper"
            color="#fff"
            backgroundColor="#40414f"
          />
        )}
      </div>
      <div className="inputContainer">
        <Input
          type="text"
          id="user-input"
          placeholder="Type your message..."
          value={chat}
          autoFocus
          autoComplete="off"
          onChange={(event) => setChat(event.target.value)}
          onKeyDown={handleKeyDown}
          className="userInput"
        />
        <Button
          colorScheme="blue"
          onClick={handleChatSent}
          className="sendMessage"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default PrivateInvestigator;
