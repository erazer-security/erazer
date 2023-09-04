import styles from "./MessageBox.module.css";
import { Comment } from "react-loader-spinner";

interface MessagesProps {
  messages: { role: string; content: string }[];
  loading: boolean;
}

export default function Message({ messages, loading }: MessagesProps) {
  return (
    <div className={styles.messagesContainer}>
      {messages.map((message, index) => {
        if (message.role === "assistant") {
          return (
            <p key={index} className={styles.assistantMessage}>
              {message.content}
            </p>
          );
        } else {
          return (
            <p key={index} className={styles.userMessage}>
              {message.content}
            </p>
          );
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
  );
}
