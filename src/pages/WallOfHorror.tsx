import styles from "./WallOfHorror.module.css";
import StoryCard from "@components/StoryCard";
import stories from "@pages/wallOfHorrorStories.json";

export default function WallOfHorror() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Wall of Horror</h1>
      <div className={styles.cards}>
        {stories.stories.map((story) => (
          <div className={styles.storyCard}>
            <StoryCard
              title={story.title}
              author={story.author}
              story={story.story}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
