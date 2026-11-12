import styles from './LoadingPage.module.css';

export default function LoadingPage() {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner} />
    </div>
  );
}
