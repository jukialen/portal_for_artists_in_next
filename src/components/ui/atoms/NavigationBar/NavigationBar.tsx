import Link from 'next/link';

import { getI18n } from 'locales/server';

import styles from './NavigationBar.module.css';
import { RiArrowUpSLine } from 'react-icons/ri';

export const NavigationBar = async ({ title, url }: { title: string; url: string }) => {
  const t = await getI18n();

  return (
    <div className={styles.tabs}>
      <Link className={styles.arrow} href={url}>
        <RiArrowUpSLine />
        <h3>{t('backPage')}</h3>
      </Link>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};
