import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

import { useHookSWR } from 'hooks/useHookSWR';

import { NavFormContext } from 'providers/NavFormProvider';
import { ShowMenuContext } from 'providers/ShowMenuProvider';
import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './Nav.module.scss';

type TitleNavType = {
  titleFirstNav: string;
  titleSecondNav: string;
};

export const Nav = ({ titleFirstNav, titleSecondNav }: TitleNavType) => {
  const { showUser } = useContext(StatusLoginContext);
  
  const { asPath, push } = useRouter();
  
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
  
  const signOut = async () => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, { withCredentials: true });
      showUser();
      // @ts-ignore
      console.log(data.message);
      return push('/');
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <nav className={`${styles.nav} ${isMenu && styles.menu__active}`}>
      <ul className={styles.list}>
        <li className={styles.menu}>
          <Link href={asPath}>
            <a
              className={styles.sign__in}
              onClick={titleFirstNav !== `${useHookSWR()?.Nav?.signOut}` ? hideMenuLogin : signOut}
            >
              {titleFirstNav}
            </a>
          </Link>
        </li>
        <li className={styles.menu}>
          <Link href={titleSecondNav === `${useHookSWR()?.Nav?.account}` ? '/account' : asPath}>
            <a className={styles.sign__out} onClick={hideMenuCreate}>
              {titleSecondNav}
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
