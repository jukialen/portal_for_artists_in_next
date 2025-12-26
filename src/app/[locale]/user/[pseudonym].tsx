import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { createServer } from 'utils/supabase/clientSSR';

import { HeadCom } from 'constants/HeadCom';

import { LangType } from 'types/global.types';

import { getI18n } from 'locales/server';

import { getUserData } from 'helpers/getUserData';
import { graphics, videosAnimations } from 'app/actions/files';
import { getFirstFriends } from 'utils/friends';
import { adminList, modsUsersList } from 'utils/groups';

import { ProfilePage } from 'components/Views/ProfilePage/ProfilePage';

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

  const t = await getI18n();

  const pseudonymName = decodeURIComponent(pseudonym);
  const userData = await getUserData();
  const id = userData?.id!;

  const tProfile = {
    userAvatar: t('Account.profile.userAvatar'),
    defaultAvatar: t('Account.profile.defaultAvatar'),
    pseudonym: t('AnotherForm.pseudonym'),
    aboutMe: t('Account.profile.aboutMe'),
  };

  const maxItems = 30;
  const fidsFavs = await getFidAndFavs(pseudonymName);
  const firstFriends = await getFirstFriends(fidsFavs?.pseudonymId!, maxItems);
  const adminGroups = await adminList(fidsFavs?.pseudonymId!, maxItems);
  const firstModsUsersList = await modsUsersList(maxItems);
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

  return (
    <ProfilePage
      id={fidsFavs?.pseudonymId!}
      author={pseudonym}
      firstAdminList={adminGroups}
      firstFriendsList={firstFriends}
      firstModsUsersList={firstModsUsersList}
      firstGraphics={firstGraphics}
      firstAnimations={firstAnimations}
      firstVideos={firstVideos}
      fidsFavs={fidsFavs}
      favs={favs}
      fave={fave}
      myProfile={false}
    />
  );
}
