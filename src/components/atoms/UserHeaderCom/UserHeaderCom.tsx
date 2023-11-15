'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import Session from 'supertokens-web-js/recipe/session';
import { Link } from '@chakra-ui/next-js';
import { Avatar, Icon, Button, Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';

import { cloudFrontUrl } from 'src/constants/links';

import { useUserData } from 'src/hooks/useUserData';

import { MenuContext } from 'src/providers/MenuProvider';

import styles from './UserHeaderCom.module.scss';
import { MdOutlineGroups, MdOutlineHome } from 'react-icons/md';
import { SearchIcon } from '@chakra-ui/icons';

type HeadersType = {
  headers: {
    home: string;
    groups: string;
    friends: string;
    search: string;
    account: string;
    profile: string;
    title: string;
    signOut: string;
    signIn: string;
    signup: string;
  },
  locale: string;
};

export const UserHeaderCom = ({ headers, locale }: HeadersType) => {
  const { changeMenu } = useContext(MenuContext);
  const [profileMenu, showProfileMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const { push } = useRouter();
  const userData = useUserData();
  
  const toggleSearch = () => setSearch(!search);
  const toggleProfileMenu = () => showProfileMenu(!profileMenu);

  const sign__out = async () => {
    try {
      await Session.signOut();
      toggleProfileMenu();
      changeMenu('false');
      push(`/${locale}/`);
    } catch (e) {
      console.log(e);
    }
  };

  console.log('userData', userData)
  return (
    <>
      <Button
        colorScheme="yellow"
        onClick={() => push(`/${locale}/app`)}
        className={styles.menu_buttons}
        aria-label="this button redirect to groups's section">
        <Icon as={MdOutlineHome} />
        <p>{headers.home}</p>
      </Button>
      <div className={styles.buttons}>
        <Button
          onClick={() => push(`/${locale}/groups/list`)}
          colorScheme="yellow"
          className={styles.menu_buttons}
          aria-label="button for groups">
          <Icon as={MdOutlineGroups} />
          <p>{headers.groups}</p>
        </Button>
        <Button
          onClick={() => push(`/${locale}/friends`)}
          colorScheme="yellow"
          className={styles.menu_buttons}
          aria-label="this button redirect to friends's section">
          <Icon
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </Icon>
          <p>{headers.friends}</p>
        </Button>
        <Button
          colorScheme="yellow"
          className={styles.menu_buttons}
          onClick={toggleSearch}
          aria-label="this button shows searching">
          <SearchIcon />
          <p>{headers.search}</p>
        </Button>
      </div>
      <Button colorScheme="yellow" className={styles.menu_buttons} onClick={toggleProfileMenu}>
        <Avatar name={userData?.pseudonym!} src={`https://${cloudFrontUrl}/${userData?.profilePhoto!}`} size="sm" />
        <p>{headers.account}</p>
      </Button>

      <InputGroup className={`${styles.search} ${search ? styles.search__active : ''}`}>
        <Input type="search" placeholder={headers.search} />
        <InputRightElement>
          <IconButton
            colorScheme="pink"
            className={styles.rightButton}
            aria-label="search phrases"
            icon={<SearchIcon />}
          />
        </InputRightElement>
      </InputGroup>
      <ul className={`${styles.menu_profile} ${profileMenu ? styles.menu_profile__active : ''}`}>
        <li>
          <Link href={`/${locale}/account/${userData?.pseudonym}`} onClick={toggleProfileMenu}>
            {headers.profile}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/settings`} onClick={toggleProfileMenu}>
            {headers.title}
          </Link>
        </li>
        <li>
          <Button colorScheme="yellow" onClick={sign__out}>
            {headers.signOut}
          </Button>
        </li>
      </ul>
    </>
  );
};
