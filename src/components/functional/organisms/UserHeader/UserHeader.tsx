import { getI18n, getScopedI18n } from 'locales/server';

import { getUserData } from '../../../../helpers/getUserData';

import { UserHeaderCom } from 'components/functional/atoms/UserHeaderCom/UserHeaderCom';

import styles from './UserHeader.module.scss';

export async function UserHeader() {
  const t = await getI18n();
  const tNav = await getScopedI18n('Nav');
  const tAside = await getScopedI18n('Aside');

  const UserHeaderTranslate = {
    home: tNav('home'),
    groups: tNav('groups'),
    friends: tNav('friends'),
    search: tNav('search'),
    account: tNav('account'),
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
      <UserHeaderCom headers={UserHeaderTranslate} userData={userData!} translated={translated} />
    </header>
  );
}
