import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';

import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import { NavFormContext } from 'providers/NavFormProvider';
import { ShowMenuContext } from 'providers/ShowMenuProvider';
import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './Nav.module.scss';

type TitleNavType = {
  titleFirstNav: string;
  titleSecondNav: string;
};

export const Nav = ({ titleFirstNav, titleSecondNav }: TitleNavType) => {
  const { asPath, push } = useRouter();
  
  const { showUser } = useContext(StatusLoginContext);
  const { isMenu, showMenu } = useContext(ShowMenuContext);
  const { showLoginForm, showCreateForm } = useContext(NavFormContext);
  
  const hideMenuLogin = () => {
    showLoginForm();
    showMenu();
  };
  
  const hideMenuCreate = () => {
    showCreateForm();
    showMenu();
  };
  
  const sign__out = async () => {
    try {
      showUser();
      await signOut(auth);
      return push('/');
    } catch (error) {
      console.log(error);
    }
  };
  
  const { pseudonym } = useUserData();
  // console.log('uD', typeof localStorage ! == 'undefined' && `${localStorage.getItem('uD')}`, `${pseudonym}`)
  
  return (
    <nav className={`${styles.nav} ${isMenu && styles.menu__active}`}>
      <ul className={styles.list}>
        <li className={styles.menu}>
          <Link href={asPath}>
            <a
              className={styles.sign__in}
              onClick={titleFirstNav !== `${useHookSWR()?.Nav?.signOut}` ? hideMenuLogin : sign__out}
            >
              {titleFirstNav}
            </a>
          </Link>
        </li>
        <li className={styles.menu}>
          <Link href={titleSecondNav === `${useHookSWR()?.Nav?.account}` ? `/account/${pseudonym}` : asPath}>
            <a className={styles.sign__out} onClick={hideMenuCreate}>
              {titleSecondNav}
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
