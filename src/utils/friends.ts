import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { cloudFrontUrl } from 'constants/links';
import { DateObjectType, FriendsListType, LangType } from 'types/global.types';
import { Database } from '../types/database.types';

import { getDate } from 'helpers/getDate';

const supabase = createServerComponentClient<Database>({ cookies });

export const getFirstFriends = async (
  dataDateObject: DateObjectType,
  id: string,
  locale: LangType,
  maxItems: number,
) => {
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
        pseudonym: _f.pseudonym!,
        fileUrl: !!_f.profilePhoto
          ? `https://${cloudFrontUrl}/${_f.profilePhoto}`
          : `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
        favorite: _f.favorite!,
        plan: _f.plan!,
        createdAt: getDate(locale, _f.createdAt!, dataDateObject),
      });
    }

    return friendArray;
  } catch (e) {
    console.error(e);
  }
};
