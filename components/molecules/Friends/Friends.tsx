import Image from 'next/image';

import styles from './Friends.module.scss';

export const Friends = () => {
  return (
    <div className={styles.friends}>
      <img src="#" className={styles.friends__item} alt="friend one" />
      <img src="#" className={styles.friends__item} alt="friend two" />
      <img src="#" className={styles.friends__item} alt="friend three" />
      <img src="#" className={styles.friends__item} alt="friend four" />
      <img src="#" className={styles.friends__item} alt="friend five" />
      <img src="#" className={styles.friends__item} alt="friend six" />
    </div>
  );
};
