import { NextRequest, NextResponse } from 'next/server';

import { LastCommentType } from 'types/global.types';

import { likeList } from 'utils/likes';
import { giveRole } from 'utils/roles';
import { createServer, Locale } from 'utils/supabase/clientSSR';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subCommentId = searchParams.get('subCommentId')!;
  const maxItems = searchParams.get('maxItems')!;
  const groupsPostsRoleId = searchParams.get('groupsPostsRoleId');

  const lastCommentArray: LastCommentType[] = [];

  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('LastComments')
      .select('*')
      .eq('subCommentId', subCommentId)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems));

    if (!!error || data?.length === 0) {
      console.error(error);
      return NextResponse.json(lastCommentArray);
    }

    for (const first of data!) {
      const { lastCommentId, subCommentId, content, roleId, authorId, createdAt, updatedAt } = first;

      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', authorId)
        .limit(1)
        .single();

      const role = await giveRole(groupsPostsRoleId || roleId);
      if (!!er || role === undefined) {
        console.error(er || 'role is undefined');
        return NextResponse.json(lastCommentArray);
      }

      lastCommentArray.push({
        lastCommentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        likes: (await likeList(authorId, undefined, undefined, undefined, undefined, undefined, lastCommentId))!.likes,
        liked: (await likeList(authorId, undefined, undefined, undefined, undefined, undefined, lastCommentId))!.liked,
        date: await getDate(updatedAt! || createdAt!, await dateData()),
        subCommentId,
      });
    }

    return NextResponse.json(lastCommentArray);
  } catch (e) {
    console.error(e);
    return NextResponse.json(lastCommentArray);
  }
}
