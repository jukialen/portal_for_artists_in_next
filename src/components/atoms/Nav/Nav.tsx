import Link from 'next/link';

import styles from './Nav.module.scss';

type HeadersType = {
  headers: {
    title: string;
    signIn: string;
    signUp: string;
  };
  locale: string
};

export const Nav = ({ headers, locale }: HeadersType) => {
  return (
    <nav className={`${styles.nav} ${locale === 'jp' ? styles.nav__jp : ''}`}>
      <ul className={styles.list}>
        <li className={styles.menu}>
          <Link href={'/signin'}>{headers.signIn}</Link>
        </li>
        <li className={styles.menu}>
          <Link href={'/signup'}>{headers.signUp}</Link>
        </li>
      </ul>
    </nav>
  );
};
