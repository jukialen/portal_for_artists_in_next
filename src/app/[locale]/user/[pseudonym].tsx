import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { createServer } from 'utils/supabase/clientSSR';
import { Tabs } from '@chakra-ui/react';

import { HeadCom } from 'constants/HeadCom';
import { GroupUsersType, LangType } from 'types/global.types';

import { getI18n, getScopedI18n } from 'locales/server';

import { getUserData } from 'helpers/getUserData';
import { graphics, videosAnimations } from 'utils/files';
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

  const { data: d, error } = await supabase.from('Users').select('id').eq('pseudonym', pseudonym).limit(1).single();
  if (!d || !!error) console.error('no user');

  const { data, error: er } = await supabase
    .from('Friends')
    .select('friendId, favorite')
    .eq('usernameId', d?.id!);

  if (data?.length === 0 || !!er) return null;

  const friendIds: { friendId: string; favorite: boolean }[] = [];

  data.forEach((item) => friendIds.push({ friendId: item.friendId, favorite: item.favorite }));

  return { friendIds, pseudonymId: d?.id };
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
        logo: !!admin.logo ? admin.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
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
        logo: !!mod.Groups?.logo ? mod.Groups.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
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
        logo: !!mem.Groups?.logo ? mem.Groups.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
      });
    }

    return memArray;
  } catch (e) {
    console.error(e);
  }
}

export async function generateMetadata({
  params: { pseudonym },
}: {
  params: { pseudonym: string };
}): Promise<Metadata> {
  return { ...HeadCom(`${pseudonym} site`) };
}

export default async function User({ params }: { params: Promise<{ locale: LangType; pseudonym: string }> }) {
  const { locale, pseudonym } = await params;
  setStaticParamsLocale(locale);

  const tAccountaMenu = await getScopedI18n('Account.aMenu');
  const tAside = await getScopedI18n('Aside');
  const t = await getI18n();

  const pseudonymName = decodeURIComponent(pseudonym);

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
    noPhotos: t('ZeroFiles.photos'),
    noAnimations: t('ZeroFiles.animations'),
    noVideos: t('ZeroFiles.videos'),
  };
  const contentList = [
    tAccountaMenu('gallery'),
    tAccountaMenu('profile'),
    tAccountaMenu('friends'),
    tAccountaMenu('groups'),
  ];
  const tProfile = {
    userAvatar: t('Account.profile.userAvatar'),
    defaultAvatar: t('Account.profile.defaultAvatar'),
    pseudonym: t('AnotherForm.pseudonym'),
    aboutMe: t('Account.profile.aboutMe'),
  };
  const fileTabList = [tAside('photos'), tAside('animations'), tAside('videos')];

  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#82FF82';
  const borderColor = '#4F8DFF';

  const user = await getUserData();
  const maxItems = 30;
  const fidsFavs = await getFidAndFavs(pseudonymName);
  const firstFriends = await getFirstFriends(fidsFavs?.pseudonymId!, maxItems);
  const adminGroups = await getAdminGroups(user?.id!, maxItems);
  const modGroups = await getModGroups(user?.id!, maxItems);
  const membersGroups = await getMembersGroups(user?.id!, maxItems);
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
  const fave = fidsFavs?.friendIds.find((f) => f.friendId === user?.id);

  return (
    <>
      <h2 className={styles.profile__user__title}>{pseudonymName}</h2>

      <FriendsButtons
        id={user?.id!}
        fid={fidsFavs?.pseudonymId!}
        pseudonym={user?.pseudonym!}
        favLength={favs}
        fav={fave!.favorite}
        friendBool={!!fave!.favorite}
        translated={tFriends}
      />
      <Tabs.Root className={styles.tabs} size="sm" lazyMount fitted variant="subtle">
        <Tabs.List className={styles.topTabList} role="tablist">
          <div className={styles.profile__user__menu}>
            <div className={styles.content}>
              {contentList.map((content, index) => (
                <Tabs.Trigger
                  key={index}
                  _selected={{ borderColor: selectedColor }}
                  _hover={{ borderColor: hoverColor }}
                  _active={{ borderColor: activeColor }}
                  borderColor={borderColor}
                  role="tab"
                  value={content}>
                  {content}
                </Tabs.Trigger>
              ))}
            </div>
          </div>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        <Tabs.Content value={contentList[0]} className={styles.tabsForPanels}>
          <Tabs.Root lazyMount variant="subtle" size="sm" fitted>
            <Tabs.List className={styles.tabList} role="tablist">
              {fileTabList.map((tab, index) => (
                <Tabs.Trigger
                  value={tab}
                  key={index}
                  className={styles.tabForPanels}
                  _selected={{ borderColor: selectedColor }}
                  _hover={{ borderColor: hoverColor }}
                  _active={{ borderColor: activeColor }}
                  borderColor={borderColor}
                  role="tab">
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value={fileTabList[0]} className={styles.tabsForPanels}>
              <PhotosGallery
                id={user?.id!}
                pseudonym={user?.pseudonym!}
                profilePhoto={user?.profilePhoto!}
                author={pseudonymName}
                firstGraphics={firstGraphics}
                tGallery={tGallery}
              />
            </Tabs.Content>
            <Tabs.Content value={fileTabList[1]} className={styles.tabPanel} role="tabpanel">
              <AnimatedGallery
                id={user?.id!}
                pseudonym={user?.pseudonym!}
                profilePhoto={user?.profilePhoto!}
                author={pseudonymName}
                firstAnimations={firstAnimations}
                tGallery={tGallery}
              />
            </Tabs.Content>
            <Tabs.Content value={fileTabList[2]} className={styles.tabPanel} role="tabpanel">
              <VideoGallery
                id={user?.id!}
                pseudonym={user?.pseudonym!}
                profilePhoto={user?.profilePhoto!}
                author={pseudonymName}
                firstVideos={firstVideos}
                tGallery={tGallery}
              />
            </Tabs.Content>
          </Tabs.Root>
        </Tabs.Content>
        <Tabs.Content value={contentList[1]} className={styles.tabPanel} role="tabpanel">
          <ProfileUser
            language={tProfile}
            pseudonym={pseudonymName}
            fileUrl={user?.profilePhoto!}
            description={user?.description!}
          />
        </Tabs.Content>
        <Tabs.Content value={contentList[1]} className={styles.tabPanel} role="tabpanel">
          <FriendsList id={user?.id!} tFriends={tFriends} firstFriendsList={firstFriends!} />
        </Tabs.Content>
        <Tabs.Content value={contentList[2]} className={styles.tabPanel} role="tabpanel">
          <GroupUser
            id={user?.id!}
            firstAdminArray={adminGroups!}
            firstModsArray={modGroups!}
            firstMembersArray={membersGroups!}
            tGroupsUser={tGroupsUser}
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
