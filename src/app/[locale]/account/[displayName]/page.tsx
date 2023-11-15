import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { getI18n, getScopedI18n } from 'src/locales/server';
import { HeadCom } from 'src/constants/HeadCom';
import { backUrl, cloudFrontUrl } from 'src/constants/links';

import { FriendType } from 'src/types/global.types';

import { get, getOnes } from 'src/helpers/methods';

import { DashboardTabs } from "src/components/organisms/DashboardTabs/DashboardTabs";
import { MainCurrentUserProfileData } from 'src/components/atoms/MainCurrentUserProfileData/MainCurrentUserProfileData';

type FriendsListArrayType = {
  usernameId: string;
  pseudonym: string;
  fileUrl: string;
};

const getFirstFriends = async (pseudonym: string, maxItems: string) => {
  try {
    const data = await getOnes(`${backUrl}/users/${pseudonym}`);

    const friendsId: FriendType[] = await get(`${backUrl}/friends/all`, {
      queryData: {
        where: { usernameId: data.id },
        orderBy: { friendId: 'desc' },
        limit: maxItems,
      },
    });
    
    const friendArray: FriendsListArrayType[] = [];

    for (const _f of friendsId) {
      friendArray.push({
        pseudonym: _f.pseudonym,
        fileUrl: !!_f.profilePhoto
          ? `https://${cloudFrontUrl}/${_f.profilePhoto}`
          : `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
        usernameId: _f.usernameId,
      });
    }

    return friendArray;
  } catch (e) {
    console.error(e);
  }
};

export const metadata: Metadata = HeadCom('Account portal site.');

export default async function Account({
  params: { locale, displayName },
}: {
  params: { locale: string; displayName: string };
}) {
  setStaticParamsLocale(locale);

  const firstFriendsList = await getFirstFriends(displayName, '30');

  const t = await getI18n();
  const tAside = await getScopedI18n('Aside');
  const tMenu = await getScopedI18n('Account.aMenu');

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
  
  return (
    <>
      <MainCurrentUserProfileData tCurrPrPhoto={tMain} />
      <DashboardTabs locale={locale} tDash={tDash} />
    </>
  );
}
