import Link from 'next/link';
import { useRouter } from 'next/router';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './Nav.module.scss';

export const Nav = () => {
  const { locale } = useRouter();
  const data = useHookSWR();

  return (
    <nav className={`${styles.nav} ${locale === 'jp' ? styles.nav__jp : ''}`}>
      <ul className={styles.list}>
        <li className={styles.menu}>
          <Link href="/signin">{data?.Nav?.signIn}</Link>
        </li>
        <li className={styles.menu}>
          <Link href="/signup">{data?.Nav?.signUp}</Link>
        </li>
      </ul>
    </nav>
  );
};
