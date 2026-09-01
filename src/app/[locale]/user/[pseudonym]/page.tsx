import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { createServer } from 'utils/supabase/clientSSR';

import { HeadCom } from 'constants/HeadCom';
import { backUrl } from 'constants/links';
import { FriendsListType, LangType } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { getLinkUrl } from 'helpers/getLinkUrl';
import { getUserData } from 'helpers/getUserData';
import { graphics, videosAnimations } from 'app/actions/files';
import { adminList, modsUsersList } from 'app/actions/groups';

import { ProfilePage } from 'components/Views/ProfilePage/ProfilePage';

async function getFidAndFavs(pseudonym: string) {
  const supabase = await createServer();

  const friendIds: FriendsListType[] = [];
  let friendFavData: {
    friendIds: FriendsListType[];
    pseudonymId: string;
    profilePhotoUser: string;
    descriptionUser: string;
  } = {
    friendIds,
    pseudonymId: '',
    profilePhotoUser: '',
    descriptionUser: '',
  };

  const { data: d, error } = await supabase
    .from('Users')
    .select('id, pseudonym, description, profilePhoto')
    .eq('pseudonym', pseudonym)
    .limit(1)
    .single();

  if (!d || !!error) return friendFavData;

  const photoLink = await getLinkUrl('profiles', `${backUrl}/#`, d?.profilePhoto!);
  friendFavData = { friendIds, pseudonymId: d.id, descriptionUser: d.description, profilePhotoUser: photoLink };

  const { data, error: er } = await supabase
    .from('Friends')
    .select('favorite, Users!usernameId (pseudonym, profilePhoto, plan), createdAt')
    .eq('friendId', d?.id!)
    .limit(30);

  if (data?.length === 0 || !!er) return friendFavData;

  for (const { favorite, Users, createdAt } of data) {
    friendFavData.friendIds.push({
      pseudonym: Users.pseudonym,
      fileUrl: await getLinkUrl('profiles', `${backUrl}/friends.svg`, Users.profilePhoto!),
      favorite,
      plan: Users.plan,
      createdAt: await getDate(createdAt!),
    });
  }

  return friendFavData;
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

  const pseudonymName = decodeURIComponent(pseudonym);
  const userData = await getUserData();

  const maxItems = 30;
  const fidsFavs = await getFidAndFavs(pseudonymName);
  const firstFriends = fidsFavs.friendIds;
  const adminGroups = await adminList(fidsFavs?.pseudonymId!, maxItems);
  const firstModsUsersList = await modsUsersList(maxItems);
  const firstGraphics = await graphics(maxItems, fidsFavs?.pseudonymId!);
  const firstAnimations = await videosAnimations(0, maxItems, fidsFavs?.pseudonymId!);
  const firstVideos = await videosAnimations(1, maxItems, fidsFavs?.pseudonymId!);

  const favs = fidsFavs?.friendIds.length;

  const found = fidsFavs?.friendIds?.find((f) => f.pseudonym.trim());
  const faved = {
    favorite: found?.favorite ?? false,
    pseudonym: found?.pseudonym ?? '',
  };

  return (
    <ProfilePage
      id={fidsFavs.pseudonymId}
      author={pseudonymName}
      photo={fidsFavs.profilePhotoUser}
      userData={userData!}
      firstAdminList={adminGroups}
      firstFriendsList={firstFriends}
      firstModsUsersList={firstModsUsersList}
      firstGraphics={firstGraphics}
      firstAnimations={firstAnimations}
      firstVideos={firstVideos}
      favs={favs}
      faved={faved}
    />
  );
}
