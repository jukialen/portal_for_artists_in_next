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
        <Link href="/terms">
          <a>{data?.Footer?.termsOfUse}</a>
        </Link>
      </button>
      <button className={styles.button}>
        <Link href="/privacy">
          <a>{data?.Footer?.privacyPolice}</a>
        </Link>
      </button>
      <button className={styles.button}>
        <Link href="/contact">
          <a>{data?.Footer?.contact}</a>
        </Link>
      </button>
      <button className={styles.button}>
        <Link href="/faq">
          <a>{data?.Footer?.faq}</a>
        </Link>
      </button>
      <button className={styles.button}>
        <Link href="/plans">
          <a>{data?.Footer?.plans}</a>
        </Link>
      </button>
      <button className={styles.button} onClick={showLanguages}>
        {data?.Footer?.changeLanguage}
        <div className={`${styles.languages} ${isLanguage && styles.languages__active}`}>
          <Link href={asPath} locale="en">
            <a className={`${styles.languages__version} button`}>EN</a>
          </Link>
          <Link href={asPath} locale="jp">
            <a className={`${styles.languages__version} button`}>JP</a>
          </Link>
          <Link href={asPath} locale="pl">
            <a className={`${styles.languages__version} button`}>PL</a>
          </Link>
        </div>
      </button>
    </footer>
  );
}
