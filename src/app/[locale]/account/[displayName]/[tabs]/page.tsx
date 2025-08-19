import { setStaticParamsLocale } from 'next-international/server';

import { LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';

import { graphics, videosAnimations } from 'utils/files';
import { getFirstFriends } from 'utils/friends';
import { adminList, modsUsersList } from 'utils/groups';

export default async function Tabs({ params }: { params: Promise<{ locale: LangType; tabs: string }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  console.log('params', await params);

  const maxItems = 30;
  const userData = await getUserData();

  const firstGraphics = await graphics(maxItems, userData?.id!, 'first');
  const firstAnimations = await videosAnimations(0, maxItems, userData?.id!, 'first');
  const firstVideos = await videosAnimations(1, maxItems, userData?.id!, 'first');
  const firstFriendsList = await getFirstFriends(userData?.id!, maxItems);
  const firstAdminList = await adminList(maxItems);
  const firstModsUsersList = await modsUsersList(maxItems);

  return <></>;
}
