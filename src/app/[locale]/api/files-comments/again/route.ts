import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getCurrentLocale } from 'locales/server';

import { FilesCommentsType } from 'types/global.types';
import { Database } from 'types/database.types';

import { likeList } from 'utils/likes';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';

const locale = getCurrentLocale();

const supabase = createServerComponentClient<Database>({ cookies });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId')!;
  const maxItems = searchParams.get('maxItems')!;

  const userData = await getUserData();

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

    if (!data || data?.length === 0 || !!error) return filesArray;

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
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }

    return filesArray;
  } catch (error) {
    console.error(error);

    return filesArray;
  }
}
