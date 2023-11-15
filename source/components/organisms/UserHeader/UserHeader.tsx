<<<<<<< Updated upstream:components/organisms/UserHeader/UserHeader.tsx
import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Session from 'supertokens-web-js/recipe/session';
import { Avatar, Icon, Button, Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';

import { useUserData } from 'hooks/useUserData';
import { useHookSWR } from 'hooks/useHookSWR';

import { cloudFrontUrl } from 'utilites/constants';

import { MenuContext } from 'providers/MenuProvider';
=======
import { getI18n, getScopedI18n } from 'source/locales/server';

import { UserHeaderCom } from 'source/components/atoms/UserHeaderCom/UserHeaderCom';
>>>>>>> Stashed changes:source/components/organisms/UserHeader/UserHeader.tsx

import styles from './UserHeader.module.scss';
import { SearchIcon } from '@chakra-ui/icons';
import { MdOutlineGroups, MdOutlineHome } from 'react-icons/md';

export function UserHeader() {
  const [profileMenu, showProfileMenu] = useState(false);
  const [search, setSearchh] = useState(false);
  const { push } = useRouter();
  const { pseudonym, profilePhoto } = useUserData();
  const data = useHookSWR();
  const { changeMenu } = useContext(MenuContext);
  const toggleSearch = () => setSearchh(!search);
  const toggleProfileMenu = () => showProfileMenu(!profileMenu);

  const sign__out = async () => {
    try {
      await Session.signOut();
      toggleProfileMenu();
      changeMenu('false');
      await push('/');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <header className={styles.header}>
      <Button
        colorScheme="yellow"
        onClick={() => push('/app')}
        className={styles.menu_buttons}
        aria-label="this button redirect to groups's section">
        <Icon as={MdOutlineHome} />
        <p>{data?.Nav?.home}</p>
      </Button>
      <div className={styles.buttons}>
        <Button
          onClick={() => push('/groups/list')}
          colorScheme="yellow"
          className={styles.menu_buttons}
          aria-label="button for groups">
          <Icon as={MdOutlineGroups} />
          <p>{data?.Nav?.groups}</p>
        </Button>
        <Button
          onClick={() => push('/friends')}
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
          <p>{data?.Nav?.friends}</p>
        </Button>
        <Button
          colorScheme="yellow"
          className={styles.menu_buttons}
          onClick={toggleSearch}
          aria-label="this button shows searching">
          <SearchIcon />
          <p>{data?.Nav?.search}</p>
        </Button>
      </div>
      <Button colorScheme="yellow" className={styles.menu_buttons} onClick={toggleProfileMenu}>
        <Avatar name={pseudonym} src={`https://${cloudFrontUrl}/${profilePhoto}`} size="sm" />
        <p>{data?.Nav?.account}</p>
      </Button>

      <InputGroup className={`${styles.search} ${search ? styles.search__active : ''}`}>
        <Input type="search" placeholder={data?.Nav?.search} />
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
          <Link href={`/account/${pseudonym}`} onClick={toggleProfileMenu}>
            {data?.Nav?.profile}
          </Link>
        </li>
        <li>
          <Link href="/settings" onClick={toggleProfileMenu}>
            {data?.Settings?.title}
          </Link>
        </li>
        <li>
          <Button colorScheme="yellow" onClick={sign__out}>
            {data?.Nav?.signOut}
          </Button>
        </li>
      </ul>
    </header>
  );
}
