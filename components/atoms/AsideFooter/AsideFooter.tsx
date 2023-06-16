import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './AsideFooter.module.scss';

export const AsideFooter = () => {
  const { locale, asPath } = useRouter();
  const data = useHookSWR();

  const [isLanguage, setLanguage] = useState(false);

  const showLanguages = () => setLanguage(!isLanguage);

  return (
    <footer className={styles.footer}>
      <div>
        <Link href="/terms">{data?.Footer?.termsOfUse}</Link>
      </div>
      <div>
        <Link href="/contact">{data?.Footer?.contact}</Link>
      </div>{' '}
      <div style={locale === 'jp' ? { fontSize: '.8rem' } : {}}>
        <Link href="/privacy">{data?.Footer?.privacyPolice}</Link>
      </div>
      <div>
        <Link href="/faq">{data?.Footer?.faq}</Link>
      </div>
      <div>
        <Link href="/plans">{data?.Footer?.plans}</Link>
      </div>
      <button className={styles.button} onClick={showLanguages}>
        {data?.Footer?.changeLanguage}
        <div className={`${styles.languages} ${isLanguage ? styles.languages__active : ''}`}>
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
};
