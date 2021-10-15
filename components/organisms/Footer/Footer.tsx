import { useState } from 'react';
import Link from 'next/link';

import './Footer.module.scss';

export function Footer() {
  const [isLanguage, setLanguage] = useState(false);

  const showLanguages = () => {
    setLanguage(!isLanguage);
  };

  return (
    <footer className="footer">
      <button className="button authors">
        <Link href="/authors">
          <a>Autorzy</a>
        </Link>
      </button>
      <button className="button terms">
        <Link href="/terms">
          <a>Warunki korzystania</a>
        </Link>
      </button>
      <button className="button privacy">
        <Link href="/privacy">
          <a>Polityka prywatność</a>i
        </Link>
      </button>
      <button className="button faq">
        <Link href="/faq">
          <a>FAQ</a>
        </Link>
      </button>
      <button className="button change__language" onClick={showLanguages}>
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
