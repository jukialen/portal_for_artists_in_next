import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { getI18n, getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { FilesUploadType, LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';
import { graphics, videosAnimations } from 'utils/files';
import { getFirstFriends } from 'utils/friends';
import { adminList, modsUsersList } from 'utils/groups';

import { DashboardTabs } from 'components/organisms/DashboardTabs/DashboardTabs';
import { MainCurrentUserProfileData } from 'components/atoms/MainCurrentUserProfileData/MainCurrentUserProfileData';

export const metadata: Metadata = HeadCom('Account portal site.');

export default async function Account({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tAside = await getScopedI18n('Aside');
  const tAnotherForm = await getScopedI18n('AnotherForm');
  const tMenu = await getScopedI18n('Account.aMenu');
  const maxItems = 30;

  const userData = await getUserData();
  const tMain = {
    validateRequired: t('NavForm.validateRequired'),
    uploadFile: t('AnotherForm.uploadFile'),
    cancelButton: t('DeletionFile.cancelButton'),
    submit: t('Description.submit'),
  };

  const fileTranslated: FilesUploadType = {
    fileSelectionCancelled: tAnotherForm('fileSelectionCancelled'),
    errorOpeningFilePicker: tAnotherForm('errorOpeningFilePicker'),
    validateRequired: t('NavForm.validateRequired'),
    fileTooLarge: tAnotherForm('fileTooLarge'),
    unsupportedFileType: tAnotherForm('unsupportedFileType'),
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

  const firstGraphics = await graphics(maxItems, userData?.id!, 'first');
  const firstAnimations = await videosAnimations(0, maxItems, userData?.id!, 'first');
  const firstVideos = await videosAnimations(1, maxItems, userData?.id!, 'first');
  const firstFriendsList = await getFirstFriends(userData?.id!, maxItems);
  const firstAdminList = await adminList(maxItems);
  const firstModsUsersList = await modsUsersList(maxItems);
  return (
    <>
      <MainCurrentUserProfileData tCurrPrPhoto={tMain} fileTranslated={fileTranslated} userData={userData!} />
      <DashboardTabs
        id={userData?.id!}
        author={userData?.pseudonym!}
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
