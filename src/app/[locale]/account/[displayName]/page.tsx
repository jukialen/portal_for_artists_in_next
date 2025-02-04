import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { getI18n, getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';
import { dateData } from 'helpers/dateData';
import { graphics, videosAnimations } from 'utils/files';
import { getFirstFriends } from 'utils/friends';
import { adminList, modsUsersList } from 'utils/groups';

import { DashboardTabs } from 'components/organisms/DashboardTabs/DashboardTabs';
import { MainCurrentUserProfileData } from 'components/atoms/MainCurrentUserProfileData/MainCurrentUserProfileData';

export const metadata: Metadata = HeadCom('Account portal site.');

export default async function Account({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tAside = await getScopedI18n('Aside');
  const tMenu = await getScopedI18n('Account.aMenu');
  const maxItems = 30;

  const dataDateObject = await dateData();

  const userData = await getUserData();

  const tMain = {
    validateRequired: t('NavForm.validateRequired'),
    uploadFile: t('AnotherForm.uploadFile'),
    cancelButton: t('DeletionFile.cancelButton'),
    submit: t('Description.submit'),
  };

  const tDash = {
    friends: tMenu('friends'),
    groups: tMenu('groups'),
    photos: tAside('photos'),
    animations: tAside('animations'),
    videos: tAside('videos'),
  };

  const tGallery = {
    userPhotosTitle: t('Account.gallery.userPhotosTitle'),
    userAnimationsTitle: t('Account.gallery.userAnimationsTitle'),
    userVideosTitle: t('Account.gallery.userVideosTitle'),
    noPhotos: t('ZeroFiles.photos'),
    noAnimations: t('ZeroFiles.animations'),
    noVideos: t('ZeroFiles.videos'),
  };

  const tFriends = {
    friends: t('Nav.friends'),
    noFriends: t('Friends.noFriends'),
  };

  const firstGraphics = await graphics(locale, maxItems, userData?.id!, dataDateObject);
  const firstAnimations = await videosAnimations(0, locale, maxItems, userData?.id!, dataDateObject);
  const firstVideos = await videosAnimations(1, locale, maxItems, userData?.id!, dataDateObject);
  const firstFriendsList = await getFirstFriends(userData?.id!, maxItems);
  const firstAdminList = await adminList(maxItems);
  const firstModsUsersList = await modsUsersList(maxItems);
  return (
    <>
      <MainCurrentUserProfileData tCurrPrPhoto={tMain} userData={userData!} />
      <DashboardTabs
        id={userData?.id!}
        author={userData?.pseudonym!}
        profilePhoto={userData?.profilePhoto!}
        dataDateObject={dataDateObject}
        locale={locale}
        tDash={tDash}
        tGallery={tGallery}
        tFriends={tFriends}
        firstGraphics={firstGraphics!}
        firstVideos={firstVideos!}
        firstAnimations={firstAnimations!}
        firstFriendsList={firstFriendsList!}
        firstAdminList={firstAdminList}
        firstModsUsersList={firstModsUsersList!}
      />
    </>
  );
}
