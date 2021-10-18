import Image from 'next/image';

import styles from './Friends.module.scss';

export const Friends = () => {
  return (
    <div className="friends">
      <Image src="/resources/icons/copy" className={styles.friends__item} layout='fill' alt="friend one" />
      <Image src="/resources/icons/copy" className={styles.friends__item} layout='fill' alt="friend two" />
      <Image src="/resources/icons/copy" className={styles.friends__item} layout='fill' alt="friend three" />
      <Image src="/resources/icons/copy" className={styles.friends__item} layout='fill' alt="friend four" />
      <Image src="/resources/icons/copy" className={styles.friends__item} layout='fill' alt="friend five" />
      <Image src="/resources/icons/copy" className={styles.friends__item} layout='fill' alt="friend six" />
    </div>
  );
};
