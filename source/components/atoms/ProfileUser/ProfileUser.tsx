import Image from 'next/image';

<<<<<<< Updated upstream:components/atoms/ProfileUser/ProfileUser.tsx
import { DataType, FileType } from 'types/global.types';

import styles from './index.module.scss';
import defaultAvatar from 'public/defaultAvatar.png';
=======
import { LanguageType, FileType } from 'source/types/global.types';

import styles from './page.module.scss';
import defaultAvatar from 'source/public/defaultAvatar.png';
>>>>>>> Stashed changes:source/components/atoms/ProfileUser/ProfileUser.tsx

export const ProfileUser = ({ data, pseudonym, description, fileUrl }: FileType | DataType) => {
  return (
    <article className={styles.profile}>
      <div className={styles.photo__profile}>
        <Image
          src={fileUrl ? fileUrl : defaultAvatar}
          alt={fileUrl ? data?.userAvatar : data?.defaultAvatar}
          aria-label={fileUrl ? data?.userAvatar : data?.defaultAvatar}
          fill
          priority
        />
      </div>
      <div className={styles.publicContainer}>
        <label className={`${styles.title} ${styles.firstTitle}`} htmlFor="pseudonym__user">
          {data?.AnotherForm?.pseudonym}
        </label>
        <div id="pseudonym__user" className={styles.input}>
          {pseudonym}
        </div>
      </div>
      <div className={styles.publicContainer}>
        <label className={styles.title} htmlFor="about__user">
          {data?.Account?.profile?.aboutMe}
        </label>
        <div id="about__user" className={styles.description}>
          {description}
        </div>
      </div>
    </article>
  );
};
