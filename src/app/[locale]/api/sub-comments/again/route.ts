import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { getCurrentLocale } from 'locales/server';

import { RoleType, SubCommentType } from 'types/global.types';
import { Database } from 'types/database.types';

import { groupRole } from 'utils/roles';
import { likeList } from 'utils/likes';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';

const locale = getCurrentLocale();

const supabase = createRouteHandlerClient<Database>({ cookies });

type DataArrayType = {
  subCommentId: string;
  content: string;
  roleId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string | null;
  Users: { id: string; pseudonym: string; profilePhoto: string | null } | null;
  Roles: { id: string; role: RoleType } | null;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('commentId');
  const fileCommentId = searchParams.get('fileCommentId');
  const maxItems = searchParams.get('maxItems')!;
  const groupsPostsRoleId = searchParams.get('groupsPostsRoleId');
  const lastVisible = searchParams.get('lastVisible');

  const userData = await getUserData();

  const subArray: SubCommentType[] = [];

  let dataArray: DataArrayType[] = [];

  try {
    if (!!commentId) {
      const { data, error } = await supabase
        .from('SubComments')
        .select(
          'subCommentId, content, roleId, authorId, createdAt, updatedAt, Users (id, pseudonym, profilePhoto), Roles (id, role)',
        )
        .gt('createdAt', lastVisible)
        .order('createdAt', { ascending: false })
        .limit(parseInt(maxItems));

      if (!data || data?.length === 0 || !!error) return subArray;

      dataArray = data;
    }

    if (!!fileCommentId) {
      const { data, error } = await supabase
        .from('SubComments')
        .select(
          'subCommentId, content, roleId, authorId, createdAt, updatedAt, Users (id, pseudonym, profilePhoto), Roles (id, role)',
        )
        .eq('fileCommentId', fileCommentId)
        .gt('createdAt', lastVisible)
        .order('createdAt', { ascending: false })
        .limit(parseInt(maxItems));

      if (!data || data?.length === 0 || !!error) return subArray;

      dataArray = data;
    }

    if (dataArray.length === 0) return subArray;

    for (const again of dataArray) {
      const { subCommentId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = again;

      const gRole = !!groupsPostsRoleId ? await groupRole(groupsPostsRoleId, Users?.id!) : Roles?.role!;

      subArray.push({
        subCommentId,
        content,
        commentId: commentId!,
        fileCommentId: fileCommentId!,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: userData?.profilePhoto!,
        role: gRole!,
        roleId: !!commentId ? groupsPostsRoleId || roleId : roleId,
        authorId,
        likes: (await likeList(authorId, undefined, undefined, commentId!, fileCommentId!))!.likes,
        liked: (await likeList(authorId, undefined, undefined, commentId!, fileCommentId!))!.liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
        groupsPostsRoleId: groupsPostsRoleId!,
      });
    }

    return subArray;
  } catch (error) {
    console.error(error);

    return subArray;
  }
}
