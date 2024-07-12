import Image from 'next/image';

import { ProfileType } from 'types/global.types';

import styles from './page.module.scss';
import defaultAvatar from 'public/defaultAvatar.png';

export const ProfileUser = ({ language, pseudonym, description, fileUrl }: ProfileType) => {
  return (
    <article className={styles.profile}>
      <div className={styles.photo__profile}>
        <Image
          src={fileUrl ? fileUrl : defaultAvatar}
          alt={fileUrl ? language?.userAvatar : language?.defaultAvatar}
          aria-label={fileUrl ? language?.userAvatar : language?.defaultAvatar}
          fill
          priority
        />
      </div>
      <div className={styles.publicContainer}>
        <label className={`${styles.title} ${styles.firstTitle}`} htmlFor="pseudonym__user">
          {language?.AnotherForm?.pseudonym}
        </label>
        <div id="pseudonym__user" className={styles.input}>
          {pseudonym}
        </div>
      </div>
      <div className={styles.publicContainer}>
        <label className={styles.title} htmlFor="about__user">
          {language?.Account?.profile?.aboutMe}
        </label>
        <div id="about__user" className={styles.description}>
          {description}
        </div>
      </div>
    </article>
  );
};
