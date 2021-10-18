import { useState } from 'react';
import Link from 'next/link';

import styles from './Footer.module.scss';

export function Footer() {
  const [isLanguage, setLanguage] = useState(false);

  const showLanguages = () => {
    setLanguage(!isLanguage);
  };

  return (
    <footer className={styles.footer}>
      <button className={styles.button}>
        <Link href="/authors">
          <a>Autorzy</a>
        </Link>
      </button>
      <button className={styles.button}>
        <Link href="/terms">
          <a>Warunki korzystania</a>
        </Link>
      </button>
      <button className={styles.button}>
        <Link href="/privacy">
          <a>Polityka prywatność</a>
        </Link>
      </button>
      <button className={styles.button}>
        <Link href="/faq">
          <a>FAQ</a>
        </Link>
      </button>
      <button className={styles.button && styles.change__language} onClick={showLanguages}>
        Zmiana języka
        <div className={`languages ${isLanguage ? 'languages--show' : ''}`}>
          <Link href="/en">
            <a>EN</a>
          </Link>
          <Link href="/jp">
            <a>JP</a>
          </Link>
        </div>
      </button>
    </footer>
  );
}
