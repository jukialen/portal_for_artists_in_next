import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { backUrl } from 'constants/links';
import { LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';
import { getLinkUrl } from 'helpers/getLinkUrl';
import { graphics, videosAnimations } from 'app/actions/files';
import { getFirstFriends } from 'utils/friends';
import { adminList, modsUsersList } from 'utils/groups';

import { ProfilePage } from 'components/Views/ProfilePage/ProfilePage';

export const metadata: Metadata = HeadCom('Account portal site.');

export default async function Account({ params }: { params: Promise<{ locale: LangType; displayName: string }> }) {
  const { locale, displayName } = await params;
  setStaticParamsLocale(locale);

  const userData = await getUserData();
  const id = userData?.id!;
  const maxItems = 30;

  const firstGraphics = await graphics(maxItems, id);
  const firstAnimations = await videosAnimations(0, maxItems, id);
  const firstVideos = await videosAnimations(1, maxItems, id);
  const firstFriendsList = await getFirstFriends(id, maxItems);
  const firstAdminList = await adminList(id, maxItems);
  const firstModsUsersList = await modsUsersList(maxItems);

  const photo = await getLinkUrl('profiles', `${backUrl}/#`, userData?.profilePhoto!);
  return (
    <ProfilePage
      id={id}
      author={displayName}
      photo={photo}
      userData={userData!}
      firstAdminList={firstAdminList}
      firstFriendsList={firstFriendsList}
      firstModsUsersList={firstModsUsersList}
      firstGraphics={firstGraphics}
      firstAnimations={firstAnimations}
      firstVideos={firstVideos}
      myProfile={true}
    />
  );
}
