import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { setStaticParamsLocale } from 'next-international/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getUserData } from 'helpers/getUserData';

import { getI18n, getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { cloudFrontUrl } from 'constants/links';
import { selectFiles } from 'constants/selects';

import { DateObjectType, FileType, FriendsListType, LangType } from 'types/global.types';
import { Database } from 'types/database.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';

import { DashboardTabs } from 'components/organisms/DashboardTabs/DashboardTabs';
import { MainCurrentUserProfileData } from 'components/atoms/MainCurrentUserProfileData/MainCurrentUserProfileData';

const supabase = createServerComponentClient<Database>({ cookies });

export const metadata: Metadata = HeadCom('Account portal site.');

const graphics = async (locale: LangType, maxItems: number, authorId: string, dataDateObject: DateObjectType) => {
  try {
    const filesArray: FileType[] = [];

    const { data } = await supabase
      .from('files')
      .select(selectFiles)
      .eq('authorId', authorId)
      .in('tags', ['realistic', 'manga', 'anime', 'comics', 'photographs'])
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0) return filesArray;

    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = file;

      filesArray.push({
        fileId,
        name,
        shortDescription,
        pseudonym: Users[0].pseudonym!,
        profilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        authorId,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        createdAt,
        updatedAt,
      });
    }
    return filesArray;
  } catch (e) {
    console.error('no your videos', e);
  }
};
const animations = async (locale: LangType, maxItems: number, authorId: string, dataDateObject: DateObjectType) => {
  try {
    const filesArray: FileType[] = [];

    const { data } = await supabase
      .from('files')
      .select(selectFiles)
      .eq('authorId', authorId)
      .eq('tags', 'animations')
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0) return filesArray;

    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = file;

      filesArray.push({
        fileId,
        name,
        shortDescription,
        pseudonym: Users[0].pseudonym!,
        profilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        authorId,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        createdAt,
        updatedAt,
      });
    }
    return filesArray;
  } catch (e) {
    console.error('no your videos', e);
  }
};
const videos = async (locale: LangType, maxItems: number, authorId: string, dataDateObject: DateObjectType) => {
  try {
    const filesArray: FileType[] = [];

    const { data } = await supabase
      .from('files')
      .select(selectFiles)
      .eq('authorId', authorId)
      .eq('tags', 'videos')
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0) return filesArray;

    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = file;

      filesArray.push({
        fileId,
        name,
        shortDescription,
        pseudonym: Users[0].pseudonym!,
        profilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        authorId,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        createdAt,
        updatedAt,
      });
    }
    return filesArray;
  } catch (e) {
    console.error('no your videos', e);
  }
};
const getFirstFriends = async (dataDateObject: DateObjectType, id: string, locale: LangType, maxItems: number) => {
  try {
    const { data } = await supabase
      .from('Friends_View')
      .select('favorite, createdAt, updatedAt, pseudonym, profilePhoto, plan')
      .eq('usernameId', id)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    const friendArray: FriendsListType[] = [];

    if (data?.length === 0) return friendArray;

    for (const _f of data!) {
      const {} = _f;
      friendArray.push({
        favorite: _f.favorite!,
        pseudonym: _f.pseudonym!,
        fileUrl: !!_f.profilePhoto
          ? `https://${cloudFrontUrl}/${_f.profilePhoto}`
          : `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
        plan: _f.plan!,
        createdAt: getDate(locale, _f.createdAt!, dataDateObject),
      });
    }

    return friendArray;
  } catch (e) {
    console.error(e);
  }
};

export default async function Account({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tAside = await getScopedI18n('Aside');
  const tMenu = await getScopedI18n('Account.aMenu');
  const maxItems = 30;

  const dataDateObject = await dateData();

  const userData = await getUserData();
  
  const tMain = {
    validateRequired: t('NavForm.validateRequired'),
    uploadFile: t('AnotherForm.uploadFile'),
    cancelButton: t('DeletionFile.cancelButton'),
    submit: t('Description.submit'),
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

  const firstGraphics = await graphics(locale, maxItems, userData?.id!, dataDateObject);
  const firstAnimations = await animations(locale, maxItems, userData?.id!, dataDateObject);
  const firstVideos = await videos(locale, maxItems, userData?.id!, dataDateObject);
  const firstFriendsList = await getFirstFriends(dataDateObject, userData?.id!, locale, maxItems);

  return (
    <>
      <MainCurrentUserProfileData tCurrPrPhoto={tMain} userData={userData!} />
      <DashboardTabs
        id={userData?.id!}
        author={userData?.pseudonym!}
        dataDateObject={dataDateObject}
        locale={locale}
        tDash={tDash}
        tGallery={tGallery}
        tFriends={tFriends}
        firstGraphics={firstGraphics!}
        firstVideos={firstVideos!}
        firstAnimations={firstAnimations!}
        firstFriendsList={firstFriendsList!}
      />
    </>
  );
}
