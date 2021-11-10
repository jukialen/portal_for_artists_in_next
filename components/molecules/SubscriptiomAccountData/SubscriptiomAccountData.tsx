import styles from './SubscriptionAccountData.module.scss';

export const SubscriptiomAccountData = () => {
  return (
    <form className={styles.form}>
      <label className={styles.title} htmlFor='subscription__info'>Subskrypcja:</label>
      <button
        id='subscription__info'
        className={`${styles.button} button`}
        aria-label='Info about subscription'
      >
        Aktualny plan
      </button>
      <button className={`${styles.button} button`} aria-label='Change subscription'>
        Zmień
      </button>
    </form>
  );
};
