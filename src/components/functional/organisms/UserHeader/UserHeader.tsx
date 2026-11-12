import Link from 'next/link';
import { getI18n, getScopedI18n } from 'locales/server';

import { getUserData } from 'helpers/getUserData';
import { signOut } from 'utils/supabase/Forms/ShignInUp';

import { supabaseStorageProfileUrl } from 'constants/links';

import { Avatar } from 'components/ui/atoms/Avatar/Avatar';
import { UserHeaderCom } from 'components/functional/atoms/UserHeaderCom/UserHeaderCom';


import { MdOutlineGroups, MdOutlineHome } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';

import styles from './UserHeader.module.css';

export async function UserHeader() {
  const t = await getI18n();
  const tNav = await getScopedI18n('Nav');
  const tAside = await getScopedI18n('Aside');

  const UserHeaderTranslate = {
    account: tNav('account'),
    friends: tNav('friends'),
    groups: tNav('groups'),
    home: tNav('home'),
    search: tNav('search'),
    profile: tNav('profile'),
    title: t('Settings.title'),
    signOut: tNav('signOut'),
    signIn: tNav('signIn'),
    signup: tNav('signUp'),
  };

  const translated = {
    category: tAside('category'),
    drawings: tAside('drawings'),
    realistic: tAside('realistic'),
    manga: tAside('manga'),
    anime: tAside('anime'),
    comics: tNav('profile'),
    photographs: tAside('photographs'),
    animations: tAside('animations'),
    videos: tAside('videos'),
    friends: tAside('friends'),
    groups: tAside('groups'),
    notFound: t('notFound'),
    searchResultTitle: t('searchResultTitle'),
  };

  const userData = await getUserData();

  return (
    <header className={styles.header}>
      <section className={styles.tabbar}>
        <div className={styles.leftPart}><Link href='/app' className={styles.menu_buttons} aria-label="this button redirect to groups's section">
          <MdOutlineHome />
          <p>{UserHeaderTranslate.home}</p>
        </Link>
          <Link href='/groups/list' className={styles.menu_buttons} aria-label="button for groups">
            <MdOutlineGroups />
            <p>{UserHeaderTranslate.groups}</p>
          </Link>
          <Link href='/friends' className={styles.menu_buttons} aria-label="this button redirect to friends's section">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p>{UserHeaderTranslate.friends}</p>
          </Link>
          <button
            className={styles.menu_buttons}
            id={styles.accountButton}
            popoverTarget="userButton"
            popoverTargetAction="toggle">
            <Avatar
              fallbackName={userData?.pseudonym!}
              src={`${supabaseStorageProfileUrl}/${userData?.profilePhoto!}`}
              alt=""
            />
            <p>{UserHeaderTranslate.account}</p>
          </button>
        </div>
        <button
          className={styles.menu_buttons}
          id={styles.searchInput}
          popoverTarget='user-header-search'
          popoverTargetAction='toggle'
          aria-label="this button shows searching">
          <IoSearch />
          <p>{UserHeaderTranslate.search}</p>
        </button>
      </section>

      <UserHeaderCom
        headers={UserHeaderTranslate}
        userData={userData!}
        translated={translated}
      />

      <ul className={styles.menu_profile} id='userButton' popover='auto'>
        <li>
          <Link
            href={`/account/${userData?.pseudonym}`}
            popoverTarget="userButton"
            popoverTargetAction='hide'>
            {UserHeaderTranslate.profile}
          </Link>
        </li>
        <li>
          <Link
            href={'/settings'}
            popoverTarget="userButton"
            popoverTargetAction='hide'>
            {UserHeaderTranslate.title}
          </Link>
        </li>
        <li>
          <form action={signOut}>
            <button
              type="submit"
              popoverTarget="userButton"
              popoverTargetAction='hide'>
              {UserHeaderTranslate.signOut}
            </button>
          </form>
        </li>
      </ul>
    </header>
  );
}

