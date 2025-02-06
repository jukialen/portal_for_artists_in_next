import { NextRequest } from 'next/server';

import { getCurrentLocale } from 'locales/server';

import { FilesCommentsType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { likeList } from 'utils/likes';
import { createServer } from 'utils/supabase/clientSSR';

const locale = getCurrentLocale();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId')!;
  const maxItems = searchParams.get('maxItems')!;

  const userData = await getUserData();

  const filesArray: FilesCommentsType[] = [];

  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('FilesComments')
      .select(
        'id, fileId, content, roleId, Roles (role), authorId, createdAt, updatedAt, Users (pseudonym, profilePhoto)',
      )
      .eq('fileId', fileId!)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems));
    if (!data || data?.length === 0 || !!error) return filesArray;

    for (const first of data!) {
      const { id, fileId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = first;

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
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }

    return filesArray;
  } catch (error) {
    console.error(error);

    return filesArray;
  }
}
