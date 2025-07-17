import { NextRequest } from 'next/server';

import { CommentType } from 'types/global.types';

import { likeList } from 'utils/likes';
import { giveRole } from 'utils/roles';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';
import { createServer, Locale } from 'utils/supabase/clientSSR';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const maxItems = searchParams.get('maxItems');
  const groupsPostsRoleId = searchParams.get('groupsPostsRoleId');

  const commentArray: CommentType[] = [];

  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Comments')
      .select('*')
      .eq('postId', postId!)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems!));

    if (!!error || data?.length === 0) {
      console.error(error);
      return commentArray;
    }
    for (const first of data!) {
      const { commentId, content, roleId, authorId, postId, createdAt, updatedAt } = first;
      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', authorId)
        .limit(1)
        .single();

      const role = await giveRole(groupsPostsRoleId || roleId);
      if (!!er || role === undefined) {
        console.error(er || 'role is undefined');
        return commentArray;
      }

      commentArray.push({
        commentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        postId,
        likes: (await likeList(authorId, postId))!.likes,
        liked: (await likeList(authorId, postId))!.liked,
        date: getDate(await Locale, updatedAt! || createdAt!, await dateData()),
      });
    }

    return commentArray;
  } catch (e) {
    console.error(e);
    return commentArray;
  }
}
