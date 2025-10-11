import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs } from '@ark-ui/react/tabs';

import { getI18n, getScopedI18n } from 'locales/server';

import { getUserData } from 'helpers/getUserData';

import { supabaseStorageProfileUrl } from 'constants/links';
import { FilesUploadType, FileType, FriendsListType, GroupUserType } from 'types/global.types';

import { FriendsButtons } from 'components/functional/atoms/FriendsButtons/FriendsButtons';

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

import styles from './ProfilePage.module.scss';
import { RiArrowUpSLine } from 'react-icons/ri';

type ProfilePageType = {
  id: string;
  author: string;
  myProfile?: boolean;
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
  fidsFavs?: null | {
    friendIds: {
      friendId: string;
      favorite: boolean;
    }[];
    pseudonymId: any;
    profilePhotoUser: any;
    descriptionUser: any;
  };
  favs?: number;
  fave?:
    | {
        friendId: string;
        favorite: boolean;
      }
    | undefined;
};

export const ProfilePage = async ({
  id,
  author,
  myProfile,
  firstFriendsList,
  firstAdminList,
  firstModsUsersList,
  firstGraphics,
  firstAnimations,
  firstVideos,
  fidsFavs,
  favs,
  fave,
}: ProfilePageType) => {
  const t = await getI18n();
  const tAnotherForm = await getScopedI18n('AnotherForm');
  const tAside = await getScopedI18n('Aside');
  const tMenu = await getScopedI18n('Account.aMenu');

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

  const userData = await getUserData();
  const pseudonym = userData?.pseudonym!;

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
      <article className={styles.mainData}>
        <div className={styles.logoPseu}>
          <div className={styles.logo}>
            <Image
              src={`${supabaseStorageProfileUrl}/${userData?.profilePhoto!}`}
              fill
              alt={`${userData?.pseudonym} logo`}
              priority
            />
            {myProfile && (
              <UpdateProfilePhotoOnAccount userData={userData!} fileTranslated={fileTranslated} tCurrPrPhoto={tMain} />
            )}
          </div>
          <h1 className={styles.name}>{userData?.pseudonym}</h1>
        </div>
        <div className={styles.description}>{userData?.description}</div>
        {myProfile && <FilesUpload userId={userData?.id!} fileTranslated={fileTranslated} />}
      </article>

      {!myProfile && (
        <FriendsButtons
          id={id}
          fid={fidsFavs?.pseudonymId!}
          pseudonym={userData?.pseudonym!}
          favLength={favs!}
          fav={fave!.favorite}
          friendBool={fave!.favorite}
          translated={tFriends}
        />
      )}
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
};
