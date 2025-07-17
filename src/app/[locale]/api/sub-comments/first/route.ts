import { NextRequest } from 'next/server';

import { RoleType, SubCommentType } from 'types/global.types';

import { groupRole } from 'utils/roles';
import { likeList } from 'utils/likes';
import { createServer, Locale } from "utils/supabase/clientSSR";

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';

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

  const userData = await getUserData();

  const subArray: SubCommentType[] = [];

  let dataArray: DataArrayType[] = [];

  try {
    const supabase = await createServer();

    if (!!commentId) {
      const { data, error } = await supabase
        .from('SubComments')
        .select(
          'subCommentId, content, roleId, authorId, createdAt, updatedAt, Users (id, pseudonym, profilePhoto), Roles (id, role)',
        )
        .eq('commentId', commentId)
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
        .order('createdAt', { ascending: false })
        .limit(parseInt(maxItems));

      if (!data || data?.length === 0 || !!error) return subArray;

      dataArray = data;
    }

    if (dataArray.length === 0) return subArray;

    for (const first of dataArray!) {
      const { subCommentId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = first;

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
        date: getDate(await Locale, updatedAt! || createdAt!, await dateData()),
        groupsPostsRoleId: groupsPostsRoleId!,
      });
    }

    return subArray;
  } catch (error) {
    console.error(error);

    return subArray;
  }
}
