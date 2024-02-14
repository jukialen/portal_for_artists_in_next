import { getI18n, getScopedI18n } from 'locales/server';

import { UserHeaderCom } from 'components/atoms/UserHeaderCom/UserHeaderCom';

import { getUserData } from "helpers/getUserData";

import styles from './UserHeader.module.scss';

export async function UserHeader({ locale }: { locale: string }) {
  const t = await getI18n();
  const tNav = await getScopedI18n('Nav');

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
  
  const userData = await getUserData();
  
  return (
    <header className={styles.header}>
      <UserHeaderCom headers={UserHeaderTranslate} locale={locale} userData={userData!} />
    </header>
  );
}
