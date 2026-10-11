import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType } from 'types/global.types';
import { getI18n } from 'locales/server';

import { getUserData } from 'helpers/getUserData';
import { getFirstFriends } from 'app/actions/friends';

import { FriendsList } from 'components/functional/molecules/FriendsList/FriendsList';

import styles from './page.module.css';

export const metadata: Metadata = HeadCom('Subpage with another categories');

export default async function Friends({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const maxItems = 30;
  const userData = await getUserData();
  const firstFriendsList = await getFirstFriends(userData?.id!, maxItems);
  const tFriends = {
    friends: t('Nav.friends'),
    noFriends: t('Friends.noFriends'),
  };

  return <div className={styles.container}>
    <h2 className={styles.title}>{tFriends.friends}</h2><FriendsList id={userData?.id!} firstFriendsList={firstFriendsList!} tFriends={tFriends} />
  </div>
}
