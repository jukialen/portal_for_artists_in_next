import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from "swr";

import { NavFormContext } from 'providers/NavFormProvider';
import { ShowMenuContext } from 'providers/ShowMenuProvider';

import styles from './Nav.module.scss';
import axios from "axios";

type TitleNavType = {
  titleFirstNav: string;
  titleSecondNav: string;
};

export const Nav = ({ titleFirstNav, titleSecondNav }: TitleNavType) => {
  const router = useRouter();
// @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data } = useSWR(`/languages/${router.locale}.json`, fetcher);
  
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
    typeof localStorage !== 'undefined' && localStorage.removeItem('SL');
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`);
    return router.push('/');
  };
  
  return (
    <nav className={`${styles.nav} ${isMenu && styles.menu__active}`}>
      <ul className={styles.list}>
        <li className={styles.menu}>
          <Link href={`${router.asPath}`}>
            <a className={styles.sign__in} onClick={titleFirstNav === `${data?.Nav?.signOut}` ? signOut : hideMenuLogin}>
              {titleFirstNav}
            </a>
          </Link>
        </li>
        <li className={styles.menu}>
          <Link href={titleSecondNav === `${data?.Nav?.account}` ? '/account' : `${router.asPath}/`}>
            <a className={styles.sign__out} onClick={hideMenuCreate}>
              {titleSecondNav}
            </a>
          </Link>
        </li>
      </ul>
      
    </nav>
  );
};
