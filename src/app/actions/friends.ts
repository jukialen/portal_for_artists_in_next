'use server';

import { backUrl } from 'constants/links';
import { FriendsListType } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { getLinkUrl } from 'helpers/getLinkUrl';
import { createServer } from 'utils/supabase/clientSSR';

export const getFirstFriends = async (id: string, maxItems: number): Promise<FriendsListType[]> => {
  const supabase = await createServer();

  const friendArray: FriendsListType[] = [];

  try {
    const { data, error } = await supabase
      .from('Friends')
      .select('favorite, Users!friendId (pseudonym, profilePhoto, plan), createdAt')
      .eq('usernameId', id)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) return friendArray;

    for (const _f of data) {
      const photoLink = await getLinkUrl('profiles', `${backUrl}/friends.svg`, _f.Users.profilePhoto!);

      friendArray.push({
        pseudonym: _f.Users.pseudonym!,
        fileUrl: photoLink,
        favorite: _f.favorite!,
        plan: _f.Users.plan!,
        createdAt: await getDate(_f.createdAt!),
      });
    }

    return friendArray;
  } catch (e) {
    console.error(e);
    return [];
  }
};
