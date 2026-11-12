'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs } from '@ark-ui/react/tabs';

import { useI18n, useScopedI18n } from 'locales/client';

import { FilesUploadType, FileType, FriendsListType, GroupUserType, UserType } from 'types/global.types';

const FriendsButtons = dynamic(() =>
  import('components/functional/atoms/FriendsButtons/FriendsButtons').then((p) => p.FriendsButtons),
);

const FriendsList = dynamic(() =>
  import('components/functional/molecules/FriendsList/FriendsList').then((mod) => mod.FriendsList),
);
const GroupUsers = dynamic(() =>
  import('components/functional/organisms/GroupUsers/GroupUsers').then((mod) => mod.GroupUsers),
);
const PhotosGallery = dynamic(() =>
  import('components/functional/organisms/PhotosGallery/PhotosGallery').then((mod) => mod.PhotosGallery),
);
const AnimatedGallery = dynamic(() =>
  import('components/functional/organisms/AnimatedGallery/AnimatedGallery').then((mod) => mod.AnimatedGallery),
);
const VideoGallery = dynamic(() =>
  import('components/functional/organisms/VideoGallery/VideoGallery').then((mod) => mod.VideoGallery),
);
const UpdateProfilePhotoOnAccount = dynamic(() =>
  import('components/functional/atoms/UpdateProfilePhotoOnAccount/UpdateProfilePhotoOnAccount').then(
    (main) => main.UpdateProfilePhotoOnAccount,
  ),
);
const FilesUpload = dynamic(() =>
  import('components/functional/molecules/FilesUpload/FilesUpload').then((fu) => fu.FilesUpload),
);

import styles from './ProfilePage.module.css';
import { RiArrowUpSLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type ProfilePageType = {
  id: string;
  author: string;
  myProfile?: boolean;
  userData: UserType | null;
  photo: string;
  firstFriendsList: FriendsListType[] | undefined;
  firstAdminList: GroupUserType[] | undefined;
  firstModsUsersList:
    | {
        members: GroupUserType[];
        moderators: GroupUserType[];
      }
    | undefined;
  firstGraphics: FileType[] | undefined;
  firstAnimations: FileType[] | undefined;
  firstVideos: FileType[] | undefined;
  favs?: number;
  faved?: {
    favorite: boolean;
    pseudonym: string;
  };
};

export const ProfilePage = ({
  id,
  author,
  myProfile = false,
  userData,
  photo,
  firstFriendsList,
  firstAdminList,
  firstModsUsersList,
  firstGraphics,
  firstAnimations,
  firstVideos,
  favs,
  faved,
}: ProfilePageType) => {
  const pseudonym = decodeURIComponent(userData?.pseudonym!);
  const { push } = useRouter();

  useEffect(() => {
    id === userData?.id! && push(`/account/${pseudonym}`);
  }, [id, userData?.id]);

  const t = useI18n();
  const tAnotherForm = useScopedI18n('AnotherForm');
  const tAside = useScopedI18n('Aside');
  const tMenu = useScopedI18n('Account.aMenu');

  const tDash = {
    friends: tMenu('friends'),
    groups: tMenu('groups'),
    photos: tAside('photos'),
    animations: tAside('animations'),
    videos: tAside('videos'),
  };
  const tMain = {
    validateRequired: t('NavForm.validateRequired'),
    uploadFile: t('AnotherForm.uploadFile'),
    cancelButton: t('DeletionFile.cancelButton'),
    submit: t('Description.submit'),
  };
  const tGallery = {
    userPhotosTitle: t('Account.gallery.userPhotosTitle'),
    userAnimationsTitle: t('Account.gallery.userAnimationsTitle'),
    userVideosTitle: t('Account.gallery.userVideosTitle'),
    noPhotos: t('ZeroFiles.photos'),
    noAnimations: t('ZeroFiles.animations'),
    noVideos: t('ZeroFiles.videos'),
  };
  const fileTranslated: FilesUploadType = {
    fileSelectionCancelled: tAnotherForm('fileSelectionCancelled'),
    errorOpeningFilePicker: tAnotherForm('errorOpeningFilePicker'),
    validateRequired: t('NavForm.validateRequired'),
    fileTooLarge: tAnotherForm('fileTooLarge'),
    unsupportedFileType: tAnotherForm('unsupportedFileType'),
  };
  const fileTabList = [tDash?.friends, tDash?.groups, tDash?.photos, tDash?.animations, tDash?.videos];
  const tFriends = {
    friends: t('Nav.friends'),
    noFriends: t('Friends.noFriends'),
    added: t('Friends.added'),
    add: t('Friends.add'),
    addedFav: t('Friends.addedFav'),
    addFav: t('Friends.addFav'),
    max: t('Friends.max'),
    addedMax: t('Friends.addedMax'),
  };

  const fileComps = [
    <FriendsList id={id} tFriends={tFriends!} firstFriendsList={firstFriendsList!} key="0" />,
    <GroupUsers id={id} firstAdminList={firstAdminList!} firstModsUsersList={firstModsUsersList!} key="1" />,
    <PhotosGallery
      id={id}
      pseudonym={pseudonym!}
      author={author}
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
      <article className={styles.mainData}>
        <div className={styles.logoPseu}>
          <div className={styles.logo}>
            <Image src={photo} fill alt={myProfile ? 'my logo' : `${author} logo`} priority />
            {myProfile && (
              <UpdateProfilePhotoOnAccount userData={userData!} fileTranslated={fileTranslated} tCurrPrPhoto={tMain} />
            )}
          </div>
          <h1 className={styles.name}>{author}</h1>
        </div>
        <div className={styles.description}>{userData?.description}</div>
        {myProfile && <FilesUpload userId={userData?.id!} plan={userData?.plan!} fileTranslated={fileTranslated} />}
      </article>

      {!myProfile && (
        <FriendsButtons
          id={userData?.id!}
          fid={id}
          favLength={favs || 0}
          fav={faved?.favorite!}
          friendBool={!!faved?.pseudonym || false}
          translated={tFriends}
        />
      )}

      <Tabs.Root className={styles.tabsMenu} defaultValue={fileTabList[0]} unmountOnExit>
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

      {Object.entries(tDash).map(([key, value]) => (
        <Link
          href={`/${myProfile ? 'account' : 'user'}/${myProfile ? pseudonym : author}/${key}`}
          className={styles.mobileTabs}
          key={key}
          aria-label="">
          <span>{value}</span>
          <RiArrowUpSLine />
        </Link>
      ))}
    </>
  );
};
