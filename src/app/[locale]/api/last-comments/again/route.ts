import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getCurrentLocale } from 'locales/server';

import { LastCommentType } from 'types/global.types';
import { Database } from 'types/database.types';

import { likeList } from 'utils/likes';
import { giveRole } from 'utils/roles';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';
import { NextRequest } from 'next/server';

const locale = getCurrentLocale();

const supabase = createServerComponentClient<Database>({ cookies });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subCommentId = searchParams.get('subCommentId')!;
  const maxItems = searchParams.get('maxItems')!;
  const groupsPostsRoleId = searchParams.get('groupsPostsRoleId');

  const lastCommentArray: LastCommentType[] = [];

  try {
    const { data, error } = await supabase
      .from('LastComments')
      .select('*')
      .gt('subCommentId', subCommentId)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems));

    if (!!error || data?.length === 0) {
      console.error(error);
      return lastCommentArray;
    }
    for (const next of data!) {
      const { lastCommentId, subCommentId, content, roleId, authorId, createdAt, updatedAt } = next;
      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', authorId)
        .limit(1)
        .single();

      const role = await giveRole(groupsPostsRoleId || roleId);
      if (!!er || role === undefined) {
        console.error(er || 'role is undefined');
        return lastCommentArray;
      }

      lastCommentArray.push({
        lastCommentId,
        subCommentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        likes: (await likeList(authorId, undefined, undefined, undefined, undefined, undefined, lastCommentId))!.likes,
        liked: (await likeList(authorId, undefined, undefined, undefined, undefined, undefined, lastCommentId))!.liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }

    return lastCommentArray;
  } catch (e) {
    console.error(e);
  }
}
