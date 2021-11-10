import Image from "next/image";

import styles from './Friends.module.scss';

const item = 64;

export const Friends = () => {
  return (
    <div className={styles.friends}>
      <Image src='/#' width={item} height={item} className={styles.friends__item} alt='friend one' />
      <Image src='/#' width={item} height={item} className={styles.friends__item} alt='friend two' />
      <Image src='/#' width={item} height={item} className={styles.friends__item} alt='friend three' />
      <Image src='/#' width={item} height={item} className={styles.friends__item} alt='friend four' />
      <Image src='/#' width={item} height={item} className={styles.friends__item} alt='friend five' />
      <Image src='/#' width={item} height={item} className={styles.friends__item} alt='friend six' />
    </div>
  );
};
