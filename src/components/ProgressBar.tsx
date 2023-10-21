import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  progress: number;
  progressText?: string;
  progressFact?: string;
}

export default function ProgressBar({
  progress,
  progressText,
  progressFact,
}: ProgressBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        {progressText && (
          <div className={styles.progressBarText}>{progressText}</div>
        )}
        <div
          className={styles.progressBarFill}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {progressFact && (
        <div className={styles.progressFact}>{progressFact}</div>
      )}
    </div>
  );
}
