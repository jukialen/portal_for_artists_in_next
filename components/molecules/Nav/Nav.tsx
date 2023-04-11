import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Session from "supertokens-web-js/recipe/session";
import { Avatar } from '@chakra-ui/react'

import { cloudFrontUrl } from 'utilites/constants';
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
  const { asPath, push, locale } = useRouter();
  const data = useHookSWR();
  const { pseudonym, profilePhoto } = useUserData();

  const { showUser } = useContext(StatusLoginContext);
  const { isMenu, showMenu } = useContext(ShowMenuContext);
  const { showLoginForm, showCreateForm } = useContext(NavFormContext);

  const hideMenuLogin = () => {
    showLoginForm();
    showMenu();
  }
  const hideMenuCreate = () => {
    showCreateForm();
    showMenu();
  };
  
  const sign__out = async () => {
    try {
      showUser();
      await Session.signOut();
      titleFirstNav !== `${data?.Nav?.sign__out}` && showMenu();
      return push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav
      className={`${styles.nav} ${isMenu && styles.menu__active} ${
        locale === 'jp' ? styles.nav__jp : ''
      }`}>
      <ul className={styles.list}>
        <li className={styles.menu}>
          <Link href={asPath}>
            <a onClick={titleFirstNav !== `${data?.Nav?.signOut}` ? hideMenuLogin : sign__out}>
              {titleFirstNav}
            </a>
          </Link>
        </li>
        <li className={styles.menu}>
          {
            titleSecondNav === `${data?.Nav?.account}` 
            ?  <div className={styles.withLogo}>
                <Avatar name={pseudonym} src={`${cloudFrontUrl}/${profilePhoto}`} size='sm' />
                <Link href={`/account/${pseudonym}`}>
                  <a onClick={hideMenuCreate}>{titleSecondNav}</a>
                </Link>
              </div>
            : <Link href={asPath}>
                <a onClick={hideMenuCreate}>{titleSecondNav}</a>
              </Link>
          }
        </li>
      </ul>
    </nav>
  );
};
