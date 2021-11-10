import styles from './AccountMenu.module.scss';

export const AccountMenu = () => {
  return (
    <article className={styles.account__menu}>
      <div className={styles.div}>
        <a href='#account__data'>Ogólne</a>
      </div>
      <div className={styles.div}>
        <a href='#user__gallery__in__account'>Galeria</a>
      </div>
      <div className={styles.div}>
        <a href='#profile'>Profil</a>
      </div>
    </article>
  );
};
