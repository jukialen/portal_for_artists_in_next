import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { createServer } from 'utils/supabase/clientSSR';
import { Tabs } from '@ark-ui/react/tabs';
import { Menu } from '@ark-ui/react/menu';

import { HeadCom } from 'constants/HeadCom';
import { backUrl } from 'constants/links';
import { GroupUsersType, LangType } from 'types/global.types';

import { getI18n, getScopedI18n } from 'locales/server';

import { getUserData } from 'helpers/getUserData';
import { graphics, videosAnimations } from 'app/actions/files';
import { getFirstFriends } from 'utils/friends';

import { FriendsButtons } from 'components/atoms/FriendsButtons/FriendsButtons';
import { ProfileUser } from 'components/atoms/ProfileUser/ProfileUser';
import { FriendsList } from 'components/molecules/FriendsList/FriendsList';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { GroupUser } from 'components/organisms/GroupUser/GroupUser';

import styles from './page.module.scss';

async function getFidAndFavs(pseudonym: string) {
  const supabase = await createServer();

  const { data: d, error } = await supabase
    .from('Users')
    .select('id, description, profilePhoto')
    .eq('pseudonym', pseudonym)
    .limit(1)
    .single();
  if (!d || !!error) console.error('no user');

  const { data, error: er } = await supabase.from('Friends').select('friendId, favorite').eq('usernameId', d?.id!);

  if (data?.length === 0 || !!er) return null;

  const friendIds: { friendId: string; favorite: boolean }[] = [];

  data.forEach((item) => friendIds.push({ friendId: item.friendId, favorite: item.favorite }));

  return { friendIds, pseudonymId: d?.id, profilePhotoUser: d?.profilePhoto, descriptionUser: d?.description };
}
async function getAdminGroups(adminId: string, maxItems: number) {
  const adminArray: GroupUsersType[] = [];

  const supabase = await createServer();

  const { data, error } = await supabase
    .from('Groups')
    .select('name, logo')
    .eq('adminId', adminId)
    .order('name', { ascending: true })
    .limit(maxItems);

  try {
    if (!data || data.length === 0 || error) return adminArray;

    for (const admin of data!) {
      adminArray.push({
        name: admin.name!,
        logo: !!admin.logo ? admin.logo : `${backUrl}/group.svg`,
      });
    }

    return adminArray;
  } catch (e) {
    console.error(e);
  }
}
async function getModGroups(userId: string, maxItems: number) {
  const modArray: GroupUsersType[] = [];

  const supabase = await createServer();

  const { data, error } = await supabase
    .from('UsersGroups')
    .select('name, Groups!name (logo)')
    .eq('userId', userId)
    .order('name', { ascending: true })
    .limit(maxItems);

  try {
    if (!data || data.length === 0 || error) return modArray;

    for (const mod of data!) {
      modArray.push({
        name: mod.name!,
        logo: !!mod.Groups?.logo ? mod.Groups.logo : `${backUrl}/group.svg`,
      });
    }

    return modArray;
  } catch (e) {
    console.error(e);
  }
}
async function getMembersGroups(userId: string, maxItems: number) {
  const memArray: GroupUsersType[] = [];

  const supabase = await createServer();

  const { data, error } = await supabase
    .from('UsersGroups')
    .select('name, Groups!name (logo)')
    .eq('userId', userId)
    .order('name', { ascending: true })
    .limit(maxItems);

  try {
    if (!data || data.length === 0 || error) return memArray;

    for (const mem of data!) {
      memArray.push({
        name: mem.name!,
        logo: !!mem.Groups?.logo ? mem.Groups.logo : `${backUrl}/group.svg`,
      });
    }

    return memArray;
  } catch (e) {
    console.error(e);
  }
}

type PropsType = {
  params: Promise<{
    locale: LangType;
    pseudonym: string;
  }>;
};

export async function generateMetadata({ params }: PropsType): Promise<Metadata> {
  const { pseudonym } = await params;
  return { ...HeadCom(`${pseudonym} site`) };
}

export default async function User({ params }: PropsType) {
  const { locale, pseudonym } = await params;
  setStaticParamsLocale(locale);

  const tAccountaMenu = await getScopedI18n('Account.aMenu');
  const tAside = await getScopedI18n('Aside');
  const t = await getI18n();

  const pseudonymName = decodeURIComponent(pseudonym);
  const userData = await getUserData();
  const id = userData?.id!;

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
  const tGroupsUser = {
    adminTitle: t('groupsUser.adminTitle'),
    modsTitle: t('groupsUser.modsTitle'),
    usersTitle: t('groupsUser.usersTitle'),
    accountAdminTitle: t('Account.groups.adminTitle'),
    accountNoMods: t('Account.groups.noMods'),
    accountNoUsers: t('Account.groups.noUsers'),
  };
  const tGallery = {
    userPhotosTitle: t('Account.gallery.userPhotosTitle'),
    userAnimationsTitle: t('Account.gallery.userAnimationsTitle'),
    userVideosTitle: t('Account.gallery.userVideosTitle'),
  };
  const tProfile = {
    userAvatar: t('Account.profile.userAvatar'),
    defaultAvatar: t('Account.profile.defaultAvatar'),
    pseudonym: t('AnotherForm.pseudonym'),
    aboutMe: t('Account.profile.aboutMe'),
  };

  const maxItems = 30;
  const fidsFavs = await getFidAndFavs(pseudonymName);
  const firstFriends = await getFirstFriends(fidsFavs?.pseudonymId!, maxItems);
  const adminGroups = await getAdminGroups(fidsFavs?.pseudonymId!, maxItems);
  const modGroups = await getModGroups(fidsFavs?.pseudonymId!, maxItems);
  const membersGroups = await getMembersGroups(fidsFavs?.pseudonymId!, maxItems);
  const firstGraphics = await graphics(maxItems, fidsFavs?.pseudonymId!, 'first');
  const firstAnimations = await videosAnimations(0, maxItems, fidsFavs?.pseudonymId!, 'first');
  const firstVideos = await videosAnimations(1, maxItems, fidsFavs?.pseudonymId!, 'first');

  const favLength = (): number => {
    let favs = 0;
    if (!!fidsFavs?.friendIds && fidsFavs?.friendIds.length > 0) {
      for (const f of fidsFavs?.friendIds!) {
        if (f.favorite) favs++;
      }
    }
    return favs;
  };
  const favs = favLength();
  const fave = fidsFavs?.friendIds.find((f) => f.friendId === id);

  const contentList = [
    tAccountaMenu('gallery'),
    tAccountaMenu('profile'),
    tAccountaMenu('friends'),
    tAccountaMenu('groups'),
  ];

  const fileTabList = [tAside('photos'), tAside('animations'), tAside('videos')];
  const fileComps = [
    <PhotosGallery
      id={fidsFavs?.pseudonymId!}
      pseudonym={pseudonym}
      author={pseudonymName}
      tGallery={tGallery}
      firstGraphics={firstGraphics}
    />,
    <AnimatedGallery
      id={fidsFavs?.pseudonymId!}
      pseudonym={pseudonym}
      author={pseudonymName}
      tGallery={tGallery}
      firstAnimations={firstAnimations}
    />,
    <VideoGallery
      id={fidsFavs?.pseudonymId!!}
      pseudonym={pseudonym}
      author={pseudonymName}
      tGallery={tGallery!}
      firstVideos={firstVideos}
    />,
  ];

  const filesList = [
    <Menu.Root>
      <Menu.Trigger>
        Open menu <Menu.Indicator>➡️</Menu.Indicator>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content className={styles.tabsForPanels}>
          {fileTabList.map((file, index) => (
            <Menu.Item value={file}>{fileComps[index]}</Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>,
    <ProfileUser
      language={tProfile}
      pseudonym={pseudonymName}
      fileUrl={fidsFavs?.profilePhotoUser!}
      description={fidsFavs?.descriptionUser!}
    />,
    <FriendsList id={userData?.id!} tFriends={tFriends} firstFriendsList={firstFriends!} />,
    <GroupUser
      id={fidsFavs?.pseudonymId!}
      firstAdminArray={adminGroups!}
      firstModsArray={modGroups!}
      firstMembersArray={membersGroups!}
      tGroupsUser={tGroupsUser}
    />,
  ];

  return (
    <>
      <h2 className={styles.profile__user__title}>{pseudonymName}</h2>

      <FriendsButtons
        id={id}
        fid={fidsFavs?.pseudonymId!}
        pseudonym={userData?.pseudonym!}
        favLength={favs}
        fav={fave!.favorite}
        friendBool={!!fave!.favorite}
        translated={tFriends}
      />
      <Tabs.Root className={styles.tabsMenu} defaultValue={contentList[0]} defaultChecked lazyMount unmountOnExit>
        <Tabs.List className={styles.topTabList} role="tablist">
          {contentList.map((tab) => (
            <Tabs.Trigger className={styles.tabForPanels} role="tab" value={tab!} key={tab}>
              {tab}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        <div className={styles.tabContents}>
          {filesList.map((comp, index) => (
            <Tabs.Content
              key={comp.key ? `${comp.key}` : `comp-${index}`}
              value={fileTabList[index]!}
              className={styles.tabContent}
              role="tabcontent">
              {comp}
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    </>
  );
}
