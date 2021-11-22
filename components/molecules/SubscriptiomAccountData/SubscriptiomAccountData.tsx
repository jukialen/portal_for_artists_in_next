import styles from './SubscriptionAccountData.module.scss';

export const SubscriptiomAccountData = ({ data }: any) => {
  return (
    <form className={styles.form}>
      <label className={styles.title} htmlFor='subscription__info'>{data?.Account?.aData?.subscription}</label>
      <button
        id='subscription__info'
        className={`${styles.button} button`}
        aria-label='Info about subscription'
      >
        {data?.Account?.aData?.currentPlan}
      </button>
      <button className={`${styles.button} button`} aria-label='Change subscription'>
        {data?.Account?.aData?.changeButton}
      </button>
    </form>
  );
};
