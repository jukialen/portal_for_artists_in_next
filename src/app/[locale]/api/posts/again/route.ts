import { NextRequest, NextResponse } from 'next/server';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { createServer } from 'utils/supabase/clientSSR';

import { PostsType } from 'types/global.types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId')!;
  const lastVisible = searchParams.get('lastVisible');
  const maxItems = searchParams.get('maxItems')!;

  const userId = searchParams.get('userId')!;
  const supabase = await createServer();

  const nextArray: PostsType[] = [];

  try {
    const { data, error } = await supabase
      .from('Posts')
      .select('*, Users (pseudonym, profilePhoto), Roles (id)')
      .eq('groupId', groupId)
      .order('createdAt', { ascending: false })
      .gt('createdAt', lastVisible)
      .limit(parseInt(maxItems));

    !!error && NextResponse.json(nextArray);

    for (const post of data!) {
      const { title, content, shared, commented, authorId, groupId, postId, createdAt, updatedAt, Users, Roles } = post;

      const { data: lData, count } = await supabase.from('Liked').select('id, userId').match({ postId, authorId });

      const indexCurrentUser = lData?.findIndex((v) => v.userId === authorId) || -1;

      const { data: rData, error: rEr } = await supabase
        .from('Roles')
        .select('id')
        .eq('groupId', groupId)
        .eq('userId', userId)
        .eq('role', 'ADMIN')
        .limit(1)
        .maybeSingle();

      !!rEr && NextResponse.json(nextArray);

      nextArray.push({
        authorName: Users?.pseudonym!,
        authorProfilePhoto: Users?.profilePhoto!,
        liked: indexCurrentUser >= 0,
        postId,
        title,
        content,
        likes: count || 0,
        shared,
        commented,
        authorId,
        groupId,
        roleId: rData?.id || Roles?.id!,
        date: await getDate(updatedAt! || createdAt!, await dateData()),
        idLiked: !!lData && lData?.length > 0 ? lData[indexCurrentUser].id : '',
      });
    }

    return NextResponse.json(nextArray);
  } catch (e) {
    console.error(e);
    return NextResponse.json(nextArray);
  }
}
