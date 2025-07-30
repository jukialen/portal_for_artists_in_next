import { NextRequest, NextResponse } from 'next/server';

import { CommentType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { likeList } from 'utils/likes';
import { giveRole } from 'utils/roles';
import { createServer, Locale } from 'utils/supabase/clientSSR';

export async function GET(req: NextRequest) {
  const commentArray: CommentType[] = [];

  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  const maxItems = searchParams.get('maxItems');
  const groupsPostsRoleId = searchParams.get('groupsPostsRoleId');

  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Comments')
      .select('*')
      .gt('postId', postId)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems!));

    if (!!error || data?.length === 0) {
      console.error(error);
      return NextResponse.json(commentArray);
    }
    for (const next of data!) {
      const { commentId, content, roleId, authorId, createdAt, updatedAt } = next;
      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', authorId)
        .limit(1)
        .single();

      const role = await giveRole(groupsPostsRoleId || roleId);
      if (!!er || role === undefined) {
        console.error(er || 'role is undefined');
        return NextResponse.json(commentArray);
      }

      commentArray.push({
        postId: postId!,
        commentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        likes: (await likeList(authorId, postId!))!.likes,
        liked: (await likeList(authorId, postId!))!.liked,
        date: getDate(await Locale, updatedAt! || createdAt!, await dateData()),
      });
    }

    return NextResponse.json(commentArray);
  } catch (e) {
    console.error(e);
    return NextResponse.json(commentArray);
  }
}
