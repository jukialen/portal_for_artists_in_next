import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';
import { Tabs } from '@ark-ui/react/tabs';

import { getI18n, getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { FilesUploadType, LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';
import { graphics, videosAnimations } from 'app/actions/files';
import { getFirstFriends } from 'utils/friends';
import { adminList, modsUsersList } from 'utils/groups';

const MainCurrentUserProfileData = dynamic(() =>
  import('components/atoms/MainCurrentUserProfileData/MainCurrentUserProfileData').then(
    (mod) => mod.MainCurrentUserProfileData,
  ),
);

const FriendsList = dynamic(() =>
  import('components/molecules/FriendsList/FriendsList').then((mod) => mod.FriendsList),
);
const GroupUsers = dynamic(() => import('components/organisms/GroupUsers/GroupUsers').then((mod) => mod.GroupUsers));
const PhotosGallery = dynamic(() =>
  import('components/organisms/PhotosGallery/PhotosGallery').then((mod) => mod.PhotosGallery),
);
const AnimatedGallery = dynamic(() =>
  import('components/organisms/AnimatedGallery/AnimatedGallery').then((mod) => mod.AnimatedGallery),
);
const VideoGallery = dynamic(() =>
  import('components/organisms/VideoGallery/VideoGallery').then((mod) => mod.VideoGallery),
);

import styles from './account.module.scss';
import { RiArrowUpSLine } from 'react-icons/ri';

export const metadata: Metadata = HeadCom('Account portal site.');

export default async function Account({ params }: { params: Promise<{ locale: LangType; displayName: string }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tAnotherForm = await getScopedI18n('AnotherForm');
  const tAside = await getScopedI18n('Aside');
  const tMenu = await getScopedI18n('Account.aMenu');

  const userData = await getUserData();
  const id = userData?.id!;
  const pseudonym = userData?.pseudonym!;
  const author = (await params).displayName;
  const maxItems = 30;

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
  const fileTabList = [tDash?.friends, tDash?.groups, tDash?.photos, tDash?.animations, tDash?.videos];

  const firstGraphics = await graphics(maxItems, id, 'first');
  const firstAnimations = await videosAnimations(0, maxItems, id, 'first');
  const firstVideos = await videosAnimations(1, maxItems, id, 'first');
  const firstFriendsList = await getFirstFriends(id, maxItems);
  const firstAdminList = await adminList(maxItems);
  const firstModsUsersList = await modsUsersList(maxItems);

  const fileComps = [
    <FriendsList id={id} tFriends={tFriends!} firstFriendsList={firstFriendsList!} key="0" />,
    <GroupUsers id={id} firstAdminList={firstAdminList!} firstModsUsersList={firstModsUsersList!} key="1" />,
    <PhotosGallery
      id={id}
      pseudonym={pseudonym!}
      author={author!}
      tGallery={tGallery}
      firstGraphics={firstGraphics}
      key="2"
    />,
    <AnimatedGallery
      id={id}
      pseudonym={pseudonym!}
      author={author}
      tGallery={tGallery}
      firstAnimations={firstAnimations}
      key="3"
    />,
    <VideoGallery
      id={id!}
      pseudonym={pseudonym!}
      author={author}
      tGallery={tGallery!}
      firstVideos={firstVideos}
      key="4"
    />,
  ];

  return (
    <>
      <MainCurrentUserProfileData tCurrPrPhoto={tMain} fileTranslated={fileTranslated} userData={userData!} />

      <Tabs.Root className={styles.tabsMenu} defaultValue={fileTabList[0]} defaultChecked lazyMount unmountOnExit>
        <Tabs.List className={styles.topTabList}>
          {fileTabList.map((tab) => (
            <Tabs.Trigger key={tab} className={styles.tabForPanels} value={tab!}>
              {tab}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        <div className={styles.tabContents}>
          {fileComps.map((comp, index) => (
            <Tabs.Content value={fileTabList[index]!} className={styles.tabContent} role="tabcontent" key={index}>
              {comp}
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>

      {fileTabList.map((tab) => (
        <Link
          href={`/account/${author}/${tab!.toLowerCase()}?back=/account/${userData?.pseudonym}`}
          className={styles.mobileTabs}
          key={tab}
          aria-label="">
          <span>{tab}</span>
          <RiArrowUpSLine />
        </Link>
      ))}
    </>
  );
}
