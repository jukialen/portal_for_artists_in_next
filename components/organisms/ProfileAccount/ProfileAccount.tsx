import styles from './ProfileAccount.module.scss';

export const ProfileAccount = () => {
  return (
    <article id="profile" className={styles.profile}>
      <div className={styles.photo__profile} />

      <div className={styles.user__name}>
        <label htmlFor="user__name">Twoja nazwa użytkownika:</label>
        <input id="user__name" type="text" />
      </div>

      <div className={styles.about__me}>
        <label htmlFor="about__me">O mnie:</label>
        <textarea id="about__me" />
      </div>
    </article>
  );
};
