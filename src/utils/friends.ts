'use server';

import { backUrl } from 'constants/links';
import { FriendsListType } from 'types/global.types';
import { createServer } from './supabase/clientSSR';
import { NextResponse } from 'next/server';
import { getDate } from '../helpers/getDate';
import { getLinkUrl } from '../helpers/getLinkUrl';

export const getFirstFriends = async (id: string, maxItems: number): Promise<FriendsListType[]> => {
  const supabase = await createServer();

  const friendArray: FriendsListType[] = [];

  try {
    const { data, error } = await supabase
      .from('Friends_View')
      .select('favorite, createdAt, updatedAt, pseudonym, profilePhoto, plan')
      .eq('usernameId', id)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) return friendArray;

    for (const _f of data!) {
      const photoLink = await getLinkUrl('profiles', `${backUrl}/friends.svg`, _f?.profilePhoto!);

      friendArray.push({
        pseudonym: _f.pseudonym!,
        fileUrl: photoLink,
        favorite: _f.favorite!,
        plan: _f.plan!,
        createdAt: await getDate(_f.createdAt!),
      });
    }

    return friendArray;
  } catch (e) {
    console.error(e);
    return [];
  }
};
