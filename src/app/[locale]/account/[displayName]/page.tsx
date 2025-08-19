import { Metadata } from 'next';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';
import { Tabs } from '@ark-ui/react/tabs';

import { getI18n, getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { FilesUploadType, LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';
import { graphics, videosAnimations } from 'utils/files';
import { getFirstFriends } from 'utils/friends';
import { adminList, modsUsersList } from 'utils/groups';

import { MainCurrentUserProfileData } from 'components/atoms/MainCurrentUserProfileData/MainCurrentUserProfileData';
import { FriendsList } from 'components/molecules/FriendsList/FriendsList';
import { GroupUsers } from 'components/organisms/GroupUsers/GroupUsers';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { getMoreRenderedContent } from '../../actions';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';

import styles from './account.module.scss';
import { RiArrowUpSLine } from 'react-icons/ri';

export const metadata: Metadata = HeadCom('Account portal site.');

export default async function Account({ params }: { params: Promise<{ locale: LangType; displayName: string }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tAside = await getScopedI18n('Aside');
  const tAnotherForm = await getScopedI18n('AnotherForm');
  const tMenu = await getScopedI18n('Account.aMenu');
  const maxItems = 30;

  const userData = await getUserData();
  const id = userData?.id!;
  const author = (await params).displayName;
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

  const firstGraphics = await graphics(maxItems, userData?.id!, 'first');
  const firstAnimations = await videosAnimations(0, maxItems, userData?.id!, 'first');
  const firstVideos = await videosAnimations(1, maxItems, userData?.id!, 'first');
  const firstFriendsList = await getFirstFriends(userData?.id!, maxItems);
  const firstAdminList = await adminList(maxItems);
  const firstModsUsersList = await modsUsersList(maxItems);
  return (
    <>
      <MainCurrentUserProfileData tCurrPrPhoto={tMain} fileTranslated={fileTranslated} userData={userData!} />

      <Tabs.Root className={styles.tabsMenu} defaultValue={fileTabList[0]} defaultChecked lazyMount unmountOnExit>
        <Tabs.List className={styles.topTabList}>
          {fileTabList.map((tab, index) => (
            <Tabs.Trigger className={styles.tabForPanels} value={tab!} key={index}>
              {tab}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        <div className={styles.tabContents}>
          <Tabs.Content value={fileTabList[0]!} className={styles.tabContent} role="tabcontent">
            <FriendsList id={id} tFriends={tFriends!} firstFriendsList={firstFriendsList!} />
          </Tabs.Content>
          <Tabs.Content value={fileTabList[1]!} className={styles.tabContent} role="tabcontent">
            <GroupUsers id={id!} firstAdminList={firstAdminList!} firstModsUsersList={firstModsUsersList!} />
          </Tabs.Content>
          <Tabs.Content value={fileTabList[2]!} className={styles.tabContent} role="tabcontent">
            {/*<PhotosGallery*/}
            {/*  id={id}*/}
            {/*  author={author}*/}
            {/*  tGallery={tGallery}*/}
            {/*  firstGraphics={firstGraphics}*/}
            {/*  initialRenderedContentAction={() => getMoreRenderedContent({ files: firstGraphics!, noEls: 1 })}*/}
            {/*/>*/}
          </Tabs.Content>
          <Tabs.Content value={fileTabList[3]!} className={styles.tabContent} role="tabcontent">
            {/*<AnimatedGallery*/}
            {/*  id={id}*/}
            {/*  author={author}*/}
            {/*  tGallery={tGallery}*/}
            {/*  firstAnimations={firstAnimations}*/}
            {/*  initialRenderedContentAction={() => getMoreRenderedContent({ files: firstAnimations!, noEls: 2 })}*/}
            {/*/>*/}
          </Tabs.Content>
          <Tabs.Content value={fileTabList[4]!} className={styles.tabContent} role="tabcontent">
            {/*<VideoGallery*/}
            {/*  id={id!}*/}
            {/*  author={author!}*/}
            {/*  tGallery={tGallery!}*/}
            {/*  firstVideos={firstVideos}*/}
            {/*  initialRenderedContentAction={() => getMoreRenderedContent({ files: firstVideos!, noEls: 3 })}*/}
            {/*/>*/}
          </Tabs.Content>
        </div>
      </Tabs.Root>

      {fileTabList.map((tab, index) => (
        <div className={styles.mobileTabs} key={index}>
          <Link href={`/account/${author}/${tab!.toLowerCase()}`} aria-label="">
            {tab}
          </Link>
          <RiArrowUpSLine />
        </div>
      ))}
    </>
  );
}
