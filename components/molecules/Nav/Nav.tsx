import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './Nav.module.scss';

import { NavFormContext } from 'providers/NavFormProvider';
import { ShowMenuContext } from 'providers/ShowMenuProvider';

type TitleNavType = {
  titleFirstNav: string;
  titleSecondNav: string;
};

export const Nav = ({ titleFirstNav, titleSecondNav }: TitleNavType) => {
  const router = useRouter();
  
  const { showLoginForm, showCreateForm } = useContext(NavFormContext);
  
  const { isMenu, showMenu } = useContext(ShowMenuContext);
  const hideMenuLogin = () => {
    showLoginForm();
    showMenu();
  };
  
  const hideMenuCreate = () => {
    showCreateForm();
    showMenu();
  };
  
  const signOut = () => {
    typeof localStorage !== 'undefined' && localStorage.removeItem('user');
    return router.push( '/' );
  };
  
  return (
    <nav className={`${styles.nav} ${isMenu && styles.menu__active}`}>
      <ul className={styles.list}>
        <li className={styles.menu}>
          <Link href='/'>
            <a className={styles.sign__in} onClick={titleFirstNav === 'Wyloguj' ? signOut : hideMenuLogin}>
              {titleFirstNav}
            </a>
          </Link>
        </li>
        <li className={styles.menu}>
          <Link href={titleSecondNav === 'Konto' ? '/account' : ''}>
            <a className={styles.sign__out} onClick={hideMenuCreate}>
              {titleSecondNav}
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
