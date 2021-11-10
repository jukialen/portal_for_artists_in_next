import styles from './ProfileAccount.module.scss';

export const ProfileAccount = () => {
  return (
    <article id='profile' className={styles.profile}>
      <div className={styles.photo__profile} />
      
      <div className={styles.user__name}>
        <label className={styles.title} htmlFor='user__name'>Twoja nazwa użytkownika:</label>
        <input id='user__name' className={styles.input} type='text' />
      </div>
      
      <div className={styles.about__me}>
        <label className={styles.title} htmlFor='about__me'>O mnie:</label>
        <textarea id='about__me' className={styles.description} />
      </div>
      
      <button className={`${styles.button} button`}>Zapisz</button>
    </article>
  );
};
