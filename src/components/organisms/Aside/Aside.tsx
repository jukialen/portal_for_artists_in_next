import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { Database } from 'types/database.types';
import { FriendsListArrayType, GroupsType } from 'types/global.types';

import { getScopedI18n } from 'locales/server';
import { getUserData } from 'helpers/getUserData';

import { AsideWrapper } from 'components/molecules/AsideWrapper/AsideWrapper';

const supabase = createServerComponentClient<Database>({ cookies });

async function getFriendsList(userId: string, maxItems: number) {
  const favoriteFriendArray: FriendsListArrayType[] = [];

  const { data, error } = await supabase
    .from('Friends')
    .select('Users (pseudonym, profilePhoto)')
    .eq('usernameId', userId)
    .eq('favorite', true)
    .order('createdAt', { ascending: true })
    .limit(maxItems);

  if (!data || !!error) return favoriteFriendArray;

  for (const _f of data!) {
    favoriteFriendArray.push({
      pseudonym: _f.Users?.pseudonym!,
      profilePhoto: !!_f.Users?.profilePhoto ? _f.Users?.profilePhoto : `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
      favorites: data.length,
    });
  }
}

async function getGroupsList(maxItems: number) {
  const groupList: GroupsType[] = [];
  const user = await getUserData();

  const { data, error } = await supabase
    .from('UsersGroups')
    .select('name, Groups (description, logo)')
    .eq('userId', user?.id!)
    .eq('favorite', true)
    .order('createdAt', { ascending: true })
    .limit(maxItems);

  try {
    if (!data || !!error) return groupList;

    for (const d of data!) {
      groupList.push({
        name: d.name,
        description: d?.Groups?.description!,
        logo: !!d.Groups?.logo
          ? d.Groups?.logo
          : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
      });
    }
  } catch (e) {
    console.error(e);
  }
}

export async function Aside() {
  const tAside = await getScopedI18n('Aside');
  const userData = await getUserData();
  const maxItems = 5;

  const friendsAsideList = await getFriendsList(userData?.id!, maxItems);
  const groupsAsideList = await getGroupsList(maxItems);

  return (
    <AsideWrapper
      asideCategory={tAside('category')}
      friendsAsideList={friendsAsideList!}
      groupsAsideList={groupsAsideList!}
    />
  );
}
