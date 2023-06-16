import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './Footer.module.scss';

export function Footer() {
  const { asPath } = useRouter();
  const data = useHookSWR();

  const [isLanguage, setLanguage] = useState(false);

  const showLanguages = () => setLanguage(!isLanguage);

  return (
    <footer className={styles.footer}>
      <button className={styles.button}>
        <Link href="/terms">{data?.Footer?.termsOfUse}</Link>
      </button>
      <button className={styles.button}>
        <Link href="/privacy">{data?.Footer?.privacyPolice}</Link>
      </button>
      <button className={styles.button}>
        <Link href="/contact">{data?.Footer?.contact}</Link>
      </button>
      <button className={styles.button}>
        <Link href="/faq">{data?.Footer?.faq}</Link>
      </button>
      <button className={styles.button}>
        <Link href="/plans">{data?.Footer?.plans}</Link>
      </button>
      <button className={styles.button} onClick={showLanguages}>
        {data?.Footer?.changeLanguage}
        <div className={`${styles.languages} ${isLanguage && styles.languages__active}`}>
          <Link href={asPath} locale="en" className={`${styles.languages__version} button`}>
            EN
          </Link>
          <Link href={asPath} locale="jp" className={`${styles.languages__version} button`}>
            JP
          </Link>
          <Link href={asPath} locale="pl" className={`${styles.languages__version} button`}>
            PL
          </Link>
        </div>
      </button>
    </footer>
  );
}
