import { NextRequest } from 'next/server';
import { createServer, Locale } from "utils/supabase/clientSSR";

import { FriendsListType } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const usernameId = searchParams.get('usernameId')!;
  const maxItems = searchParams.get('maxItems')!;

  const supabase = await createServer();
  

  try {
    const { data } = await supabase
      .from('Friends_View')
      .select('favorite, createdAt, updatedAt, pseudonym, profilePhoto, plan')
      .eq('usernameId', usernameId)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems));

    const friendArray: FriendsListType[] = [];

    if (data?.length === 0) return friendArray;

    for (const _f of data!) {
      const {} = _f;
      friendArray.push({
        pseudonym: _f.pseudonym!,
        fileUrl: !!_f.profilePhoto ? _f.profilePhoto : `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
        favorite: _f.favorite!,
        plan: _f.plan!,
        createdAt: getDate(await Locale, _f.createdAt!, await dateData()),
      });
    }

    return friendArray;
  } catch (e) {
    console.error(e);
  }
}
