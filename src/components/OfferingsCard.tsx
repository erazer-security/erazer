import styles from "./OfferingsCard.module.css";

interface OfferingsCardProps {
  product: string;
  description: string;
}

export default function OfferingsCard({
  product,
  description,
}: OfferingsCardProps) {
  return (
    <>
      <div className={`${styles.card}`}>
        <p className={styles.product}>{product}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </>
  );
}
