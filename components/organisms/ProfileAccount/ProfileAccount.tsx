import styles from './ProfileAccount.module.scss';

export const ProfileAccount = ({ data }: any) => {
  return (
    <article id='profile' className={styles.profile}>
      <div className={styles.photo__profile} />
      
      <div className={styles.user__name}>
        <label className={styles.title} htmlFor='user__name'>{data?.Account?.profile?.name}</label>
        <input id='user__name' className={styles.input} type='text' />
      </div>
      
      <div className={styles.about__me}>
        <label className={styles.title} htmlFor='about__me'>{data?.Account?.profile?.aboutMe}</label>
        <textarea id='about__me' className={styles.description} />
      </div>
      
      <button className={`${styles.button} button`}>{data?.Account?.profile?.save}</button>
    </article>
  );
};
