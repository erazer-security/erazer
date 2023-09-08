import styles from "./StoryCard.module.css";

interface StoryCardProps {
  title: string;
  author: string;
  story: string;
}

export default function StoryCard({ title, author, story }: StoryCardProps) {
  return (
    <>
      <div className={styles.card}>
        <p className={styles.title}>{title}</p>
        <p className={styles.author}>{author}</p>
        <p className={styles.story}>{story}</p>
      </div>
    </>
  );
}
