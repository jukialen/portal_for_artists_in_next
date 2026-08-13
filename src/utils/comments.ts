'use server';

import { Database } from 'types/database.types';
import { CommentType, FilesCommentsType, NewCommentsType, RoleType, CommentsTableNameType } from 'types/global.types';
import { createServer } from './supabase/clientSSR';

import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { likeList } from 'utils/server/likes';
import { giveRole, groupRole } from 'utils/server/roles';

import { selectCommentsData, updDelCommentsData } from '../constants/values';

type JoinedCommentRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'] & {
  Users: {
    pseudonym: string;
    profilePhoto: string;
  };
  Roles: {
    role: RoleType;
  };
};

interface CommentsData {
  maxItems?: number;
  step?: 'first' | 'again';
  postId?: string;
  commentId?: string | null;
  fileCommentId?: string | null;
  subCommentId?: string;
  lastCommentId?: string;
  fileId?: string;
  lastVisible?: string;
  groupsPostsRoleId?: string;
}

interface UpdateCommentsData {
  postId?: string;
  commentId?: string | null;
  fileCommentId?: string | null;
  subCommentId?: string;
  lastCommentId?: string;
  fileId?: string;
}

//POST
export const newComment = async (commentData: NewCommentsType): Promise<{ role: RoleType | ''; message: string }> => {
  try {
    const { content, authorId, postId, fileId, fileCommentId, commentId, subCommentId } = commentData;
    const supabase = await createServer();
    const userData = await getUserData();

    const role: RoleType = authorId === userData?.id! ? 'AUTHOR' : 'USER';

    const { data, error: roleError } = await supabase
      .from('Roles')
      .insert([{ role, userId: userData?.id!, postId, fileId, fileCommentId, commentId, subCommentId }])
      .select('id')
      .limit(1)
      .maybeSingle();

    if (!data || !!roleError) return { role: '', message: 'no role' };

    if (!!postId) {
      const { error } = await supabase.from('Comments').insert([{ content, authorId, postId, roleId: data.id }]);

      if (!!error) {
        console.error(error);
        return { role: '', message: 'no post id' };
      }
    }

    if (!!fileId) {
      const { error } = await supabase.from('FilesComments').insert([{ content, authorId, fileId, roleId: data.id }]);

      if (!!error) {
        console.error('fileId error', error);
        return { role: '', message: 'no file id' };
      }
    }

    if (!!fileCommentId || !!commentId) {
      const { error } = await supabase
        .from('SubComments')
        .insert([{ content, authorId, commentId, fileCommentId, roleId: data.id }]);

      if (!!error) {
        console.error(error);
        return { role: '', message: 'no second nested comment id' };
      }
    }

    if (!!subCommentId) {
      const { error } = await supabase
        .from('LastComments')
        .insert([{ content, authorId, subCommentId, roleId: data.id }]);

      if (!!error) {
        console.error(error);
        return { role: '', message: 'no last nested comment id' };
      }
    }

    return { role, message: '' };
  } catch (e: any) {
    console.error(e);
    return { role: '', message: e.message };
  }
};

//GET
export const comments = async ({
  maxItems = 30,
  step = 'first',
  postId,
  commentId,
  fileCommentId,
  subCommentId,
  lastCommentId,
  fileId,
  lastVisible,
  groupsPostsRoleId,
}: CommentsData): Promise<CommentType[]> => {
  const commentArray: CommentType[] = [];

  const { tableName, columnValue, columnIdName } = selectCommentsData(
    postId,
    fileId,
    commentId,
    fileCommentId,
    subCommentId,
    lastCommentId,
  );

  if (columnIdName === 'lastCommentId') return commentArray;

  const supabase = await createServer();

  try {
    const selectQuery = '*, Roles!roleId (role), Users!authorId (pseudonym, profilePhoto)';

    let query = supabase
      .from(tableName)
      .select(selectQuery)
      .eq(columnIdName as any, columnValue)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (step !== 'first' && lastVisible) query = query.gt('createdAt', lastVisible);

    const { data, error } = await query;

    if (!!error || data?.length === 0) {
      console.error(error);
      return [];
    }

    if (tableName === 'FilesComments')
      return await filesApiComments(tableName, data as JoinedCommentRow<typeof tableName>[]);
    if (tableName === 'SubComments')
      return await subComments(tableName, data as JoinedCommentRow<typeof tableName>[], groupsPostsRoleId);
    if (tableName === 'LastComments')
      return await lastComments(tableName, data as JoinedCommentRow<typeof tableName>[], groupsPostsRoleId);

    for (const a of data as JoinedCommentRow<'Comments'>[]) {
      const { commentId, content, roleId, authorId, postId, createdAt, updatedAt, Roles, Users } = a;
      const likesData = await likeList(authorId, 'postId', postId);

      const gRole = !!groupsPostsRoleId ? await groupRole(groupsPostsRoleId, authorId!) : Roles?.role!;
      commentArray.push({
        commentId,
        content,
        authorName: Users.pseudonym!,
        authorProfilePhoto: Users.profilePhoto!,
        role: gRole,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        postId,
        idLiked: likesData.idLiked,
        likes: likesData.likes,
        liked: likesData.liked,
        date: await getDate(updatedAt! || createdAt!),
        tableName,
      });
    }

    return commentArray;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const filesApiComments = async (
  tableName: CommentsTableNameType,
  commentsData: JoinedCommentRow<'FilesComments'>[],
) => {
  try {
    const filesArray: FilesCommentsType[] = [];

    for (const d of commentsData) {
      const { id: fileCommentId, fileId, content, roleId, authorId, createdAt, updatedAt, Roles, Users } = d;
      const likesData = await likeList(authorId, 'fileCommentId', fileCommentId);

      filesArray.push({
        fileCommentId,
        fileId,
        content,
        authorName: Users.pseudonym,
        authorProfilePhoto: Users.profilePhoto,
        role: Roles.role,
        roleId,
        authorId,
        likes: likesData.likes,
        liked: likesData.liked,
        idLiked: likesData.idLiked,
        date: await getDate(updatedAt! || createdAt!),
        tableName,
      });
    }

    return filesArray;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const subComments = async (
  tableName: CommentsTableNameType,
  commentsData: JoinedCommentRow<'SubComments'>[],
  groupsPostsRoleId?: string,
) => {
  const subArray: CommentType[] = [];

  for (const c of commentsData) {
    const { subCommentId, commentId, fileCommentId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = c;

    const likesData = await likeList(authorId, 'subCommentId', subCommentId);
    const gRole = !!groupsPostsRoleId ? await groupRole(groupsPostsRoleId, authorId!) : Roles?.role!;

    subArray.push({
      subCommentId,
      content,
      commentId,
      fileCommentId,
      authorName: Users?.pseudonym!,
      authorProfilePhoto: Users?.profilePhoto!,
      role: gRole!,
      roleId: groupsPostsRoleId || roleId,
      authorId,
      likes: likesData.likes,
      liked: likesData.liked,
      idLiked: likesData.idLiked,
      date: await getDate(updatedAt! || createdAt!),
      tableName,
    });
  }

  return subArray;
};

const lastComments = async (
  tableName: CommentsTableNameType,
  commentsData: JoinedCommentRow<'LastComments'>[],
  groupsPostsRoleId?: string,
) => {
  const lastCommentArray: CommentType[] = [];

  for (const c of commentsData) {
    const { lastCommentId, subCommentId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = c;

    const likesData = await likeList(authorId, 'lastCommentId', subCommentId);
    const gRole = !!groupsPostsRoleId ? await groupRole(groupsPostsRoleId, authorId!) : Roles?.role!;

    lastCommentArray.push({
      lastCommentId,
      content,
      authorName: Users?.pseudonym!,
      authorProfilePhoto: Users?.profilePhoto!,
      role: gRole,
      roleId: groupsPostsRoleId || roleId,
      authorId,
      likes: likesData!.likes,
      liked: likesData!.liked,
      idLiked: likesData!.idLiked,
      date: await getDate(updatedAt! || createdAt!),
      subCommentId,
      tableName,
    });
  }

  return lastCommentArray;
};

//PATCH

export const updComment = async (
  { commentId, fileCommentId, subCommentId, lastCommentId }: UpdateCommentsData,
  content: string,
): Promise<boolean> => {
  try {
    const supabase = await createServer();

    const { tableName, columnValue, columnIdName } = updDelCommentsData(
      commentId,
      fileCommentId,
      subCommentId,
      lastCommentId,
    );

    const { error } = await supabase
      .from(tableName)
      .update({ content })
      .eq(columnIdName as any, columnValue);

    console.log('error', error);
    return !error;
  } catch (e) {
    console.error(e);
    return false;
  }
};

///DELETE
export const delComment = async ({
  commentId,
  fileCommentId,
  subCommentId,
  lastCommentId,
}: UpdateCommentsData): Promise<{ message: string; error: string }> => {
  try {
    const supabase = await createServer();
    const author = await getUserData();

    const { tableName, columnValue, columnIdName } = updDelCommentsData(
      commentId,
      fileCommentId,
      subCommentId,
      lastCommentId,
    );

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq(columnIdName as any, columnValue)
      .eq('authorId', author?.id!);

    return { message: error ? 'Failed to delete comment' : 'Comment was deleted', error: error?.message || '' };
  } catch (e: any) {
    console.error(e);
    return { message: '', error: e.message };
  }
};
