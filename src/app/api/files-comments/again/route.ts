import { NextRequest, NextResponse } from 'next/server';

import { FilesCommentsType } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { likeList } from 'utils/likes';
import { createServer } from 'utils/supabase/clientSSR';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId')!;
  const maxItems = searchParams.get('maxItems')!;

  const userData = await getUserData();

  const supabase = await createServer();

  const filesArray: FilesCommentsType[] = [];

  try {
    const { data, error } = await supabase
      .from('FilesComments')
      .select(
        'id, fileId, content, roleId, Roles (role), authorId, createdAt, updatedAt, Users (pseudonym, profilePhoto)',
      )
      .gt('fileId', fileId)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems));

    if (!data || data?.length === 0 || !!error) return NextResponse.json(filesArray);

    for (const again of data!) {
      const { id, fileId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = again;

      filesArray.push({
        fileCommentId: id,
        fileId,
        content,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: userData?.profilePhoto!,
        role: Roles?.role!,
        roleId,
        authorId,
        likes: (await likeList(authorId, undefined, fileId))!.likes,
        liked: (await likeList(authorId, undefined, fileId))!.liked,
        date: await getDate(updatedAt! || createdAt!),
      });
    }

    return NextResponse.json(filesArray);
  } catch (error) {
    console.error(error);
    return NextResponse.json(filesArray);
  }
}
