import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { getI18n, getScopedI18n } from 'locales/server';

import { LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';

import { getFirstFriends } from 'utils/friends';
import { adminList, modsUsersList } from 'utils/groups';
import { graphics, videosAnimations } from 'app/actions/files';

import { NavigationBar } from 'components/ui/atoms/NavigationBar/NavigationBar';
import { FriendsList } from 'components/functional/molecules/FriendsList/FriendsList';
import { AnimatedGallery } from 'components/functional/organisms/AnimatedGallery/AnimatedGallery';
import { GroupUsers } from 'components/functional/organisms/GroupUsers/GroupUsers';
import { PhotosGallery } from 'components/functional/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/functional/organisms/VideoGallery/VideoGallery';

interface PropsType {
  params: Promise<{ locale: LangType; displayName: string; tabs: string }>;
}

export default async function Tabs({ params }: PropsType) {
  const { locale, displayName, tabs } = await params;
  setStaticParamsLocale(locale);

  const maxItems = 30;
  const userData = await getUserData();
  const id = userData?.id!;
  const pseudonym = userData?.pseudonym!;

  const t = await getI18n();
  const tAside = await getScopedI18n('Aside');
  const tMenu = await getScopedI18n('Account.aMenu');

  const firstGraphics = await graphics(maxItems, id, 'first');
  const firstAnimations = await videosAnimations(0, maxItems, id, 'first');
  const firstVideos = await videosAnimations(1, maxItems, id, 'first');
  const firstFriendsList = await getFirstFriends(id, maxItems);
  const firstAdminList = await adminList(id, maxItems);
  const firstModsUsersList = await modsUsersList(maxItems);

  const allowedTabs = ['friends', 'groups', 'photos', 'animations', 'videos'] as const;
  const backUrl = `/account/${displayName}`;

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
  const tDash = {
    friends: tMenu('friends'),
    groups: tMenu('groups'),
    photos: tAside('photos'),
    animations: tAside('animations'),
    videos: tAside('videos'),
  };

  type TabKey = (typeof allowedTabs)[number];

  const getLabel = (tab: string) => (allowedTabs.includes(tab as TabKey) ? tDash[tab as TabKey] : '');

  const renderComp = async () => {
    switch (tabs) {
      case 'photos':
        return (
          <PhotosGallery
            id={id}
            pseudonym={pseudonym!}
            author={displayName}
            tGallery={tGallery}
            firstGraphics={firstGraphics}
          />
        );
      case 'animations':
        return (
          <AnimatedGallery
            id={id}
            pseudonym={pseudonym!}
            author={displayName}
            tGallery={tGallery}
            firstAnimations={firstAnimations}
          />
        );
      case 'videos':
        return (
          <VideoGallery
            id={id!}
            pseudonym={pseudonym!}
            author={displayName}
            tGallery={tGallery!}
            firstVideos={firstVideos}
          />
        );
      case 'friends':
        return <FriendsList id={id} tFriends={tFriends!} firstFriendsList={firstFriendsList!} />;
      case 'groups':
        return <GroupUsers id={id!} firstAdminList={firstAdminList!} firstModsUsersList={firstModsUsersList!} />;
      default:
        return (
          <div>
            <span>Wrong page:</span>
            <Link href={backUrl}>Come back</Link>
          </div>
        );
    }
  };

  return (
    <>
      <NavigationBar title={getLabel(tabs)} url={backUrl} />
      {await renderComp()}
    </>
  );
}
