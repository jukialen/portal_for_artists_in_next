'use server';

import { backUrl } from 'constants/links';
import {
  CommentType,
  FilesCommentsType,
  LastCommentType,
  NewCommentsType,
  RoleType,
  SubCommentType,
  CommentsTableNameType,
} from 'types/global.types';
import { createServer } from './supabase/clientSSR';
import { likeList } from './likes';
import { getDate } from 'helpers/getDate';
import { giveRole } from './server/roles';
import { getUserData } from '../helpers/getUserData';
import { groupRole } from './client/roles';

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

//POST
export const newComment = async (commentData: NewCommentsType): Promise<{ role: RoleType | ''; message: string }> => {
  try {
    const { content, authorId, postId, roleId, fileId, fileCommentId, commentId, subCommentId } = commentData;
    const supabase = await createServer();

    if (roleId === 'no id') return { role: '', message: 'no role id' };

    if (!!postId) {
      const { error } = await supabase.from('Comments').insert([{ content, authorId, postId, roleId: roleId! }]);

      if (!!error) {
        console.error(error);
        return { role: '', message: 'no post id' };
      }
    }

    if (!!fileId) {
      const { error } = await supabase.from('FilesComments').insert([{ content, authorId, fileId, roleId: roleId! }]);

      if (!!error) {
        console.error('fileId error', error);
        return { role: '', message: 'no file id' };
      }
    }

    if (!!fileCommentId || !!commentId) {
      const { error } = await supabase
        .from('SubComments')
        .insert([{ content, authorId, commentId, fileCommentId, roleId: roleId! }]);

      if (!!error) {
        console.error(error);
        return { role: '', message: 'no second nested comment id' };
      }
    }

    if (!!subCommentId) {
      const { error } = await supabase
        .from('LastComments')
        .insert([{ content, authorId, subCommentId, roleId: roleId! }]);

      if (!!error) {
        console.error(error);
        return { role: '', message: 'no last nested comment id' };
      }
    }

    const { role, message }: { role: RoleType | ''; message: string } = await giveRole(roleId!);

    !!message && console.error(`Error: ${message} with role: '${role}'.`);

    return { role, message };
  } catch (e: any) {
    console.error(e);
    return { role: '', message: e.message };
  }
};

//GET
export const comments = async (
  postId: string,
  maxItems: number,
  groupsPostsRoleId: string,
  step: 'first' | 'again' = 'first',
): Promise<CommentType[]> => {
  const supabase = await createServer();

  let array: {
    authorId: string;
    commentId: string;
    content: string;
    createdAt: string;
    postId: string;
    roleId: string;
    updatedAt: string | null;
    Users: {
      pseudonym: string;
      profilePhoto: string;
    };
    Roles: {
      role: RoleType;
    };
  }[] = [];

  const commentArray: CommentType[] = [];

  const tableName = 'Comments';

  try {
    if (step === 'first') {
      const { data, error } = await supabase
        .from(tableName)
        .select('*, Roles!roleId (role), Users!authorId (pseudonym, profilePhoto)')
        .eq('postId', postId!)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (!!error || data?.length === 0) {
        console.error(error);
        return [];
      }

      array = data;
    } else {
      const { data, error } = await supabase
        .from(tableName)
        .select('*, Roles!roleId (role), Users (pseudonym, profilePhoto)')
        .gt('postId', postId)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (!!error || data?.length === 0) {
        console.error(error);
        return [];
      }

      array = data;
    }

    for (const first of array) {
      const { commentId, content, roleId, authorId, postId, createdAt, updatedAt, Roles, Users } = first;
      const likesData = await likeList(authorId, 'postId', postId);

      commentArray.push({
        commentId,
        content,
        authorName: Users.pseudonym!,
        authorProfilePhoto: Users.profilePhoto!,
        role: Roles.role,
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

export const filesApiComments = async (
  fileId: string,
  maxItems: number,
  stage: 'first' | 'again' = 'first',
): Promise<FilesCommentsType[]> => {
  try {
    const supabase = await createServer();

    const filesArray: FilesCommentsType[] = [];

    let commentsData: {
      id: string;
      fileId: string;
      content: string;
      roleId: string;
      Roles: { role: RoleType };
      authorId: string;
      createdAt: string;
      updatedAt: string | null;
      Users: {
        pseudonym: string;
        profilePhoto: string;
      };
    }[];

    const tableName = 'FilesComments';

    if (stage === 'first') {
      const { data, error } = await supabase
        .from(tableName)
        .select(
          'id, fileId, content, roleId, Roles!roleId (role), authorId, createdAt, updatedAt, Users!authorId (pseudonym, profilePhoto)',
        )
        .eq('fileId', fileId)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (!data || data?.length === 0 || !!error) return filesArray;
      commentsData = data;
    } else {
      const { data, error } = await supabase
        .from(tableName)
        .select(
          'id, fileId, content, roleId, Roles!roleId (role), authorId, createdAt, updatedAt, Users!authorId (pseudonym, profilePhoto)',
        )
        .gt('fileId', fileId)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (!data || data?.length === 0 || !!error) return filesArray;

      commentsData = data;
    }

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

export const subComments = async (
  step: 'first' | 'again' = 'first',
  maxItems: number = 30,
  commentId?: string,
  fileCommentId?: string,
  groupsPostsRoleId?: string,
  lastVisible?: string,
): Promise<SubCommentType[]> => {
  const userData = await getUserData();

  const subArray: SubCommentType[] = [];

  let dataArray: DataArrayType[] = [];

  const supabase = await createServer();

  try {
    if (step === 'first') {
      const { data, error } = await supabase
        .from('SubComments')
        .select(
          'subCommentId, content, roleId, authorId, createdAt, updatedAt, Users (id, pseudonym, profilePhoto), Roles (id, role)',
        )
        .eq(commentId ? 'commentId' : 'fileCommentId', commentId || fileCommentId!)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (!data || data?.length === 0 || !!error) return subArray;

      dataArray = data;
    } else {
      const { data, error } = await supabase
        .from('SubComments')
        .select(
          'subCommentId, content, roleId, authorId, createdAt, updatedAt, Users (id, pseudonym, profilePhoto), Roles (id, role)',
        )
        .eq(commentId ? 'commentId' : 'fileCommentId', commentId || fileCommentId!)
        .gt('createdAt', lastVisible)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (!data || data?.length === 0 || !!error) return subArray;

      dataArray = data;
    }

    for (const again of dataArray) {
      const { subCommentId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = again;

      const gRole = !!groupsPostsRoleId ? await groupRole(groupsPostsRoleId, Users?.id!) : Roles?.role!;

      const likesData = await likeList(authorId, 'subCommentId', subCommentId);

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
        likes: likesData.likes,
        liked: likesData.liked,
        idLiked: likesData.idLiked,
        date: await getDate(updatedAt! || createdAt!),
        groupsPostsRoleId: groupsPostsRoleId!,
      });
    }

    return subArray;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const lastComments = async (
  subCommentId: string,
  maxItems: number,
  groupsPostsRoleId: string,
  step: 'first' | 'again',
): Promise<LastCommentType[]> => {
  const params = { subCommentId, maxItems: maxItems.toString(), groupsPostsRoleId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: LastCommentType[] = await fetch(`${backUrl}/api/last-comments/${step}?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error(e);
        return [];
      });

    return res || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

//PATCH

export const updComment = async (tableName: CommentsTableNameType, id: string, content: string): Promise<boolean> => {
  try {
    const supabase = await createServer();
    const author = await getUserData();

    const queryMap = {
      Comments: () => supabase.from('Comments').update({ content }).eq('commentId', id),
      FilesComments: () => supabase.from('FilesComments').update({ content }).eq('id', id),
      SubComments: () => supabase.from('SubComments').update({ content }).eq('subCommentId', id),
      LastComments: () => supabase.from('LastComments').update({ content }).eq('lastCommentId', id),
    };

    const { error } = await queryMap[tableName]().eq('authorId', author?.id!);

    return !!error;
  } catch (e) {
    console.error(e);
    return false;
  }
};

///DELETE
export const delComment = async (
  tableName: CommentsTableNameType,
  id: string,
): Promise<{ message: string; error: string }> => {
  try {
    const supabase = await createServer();

    const author = await getUserData();

    const queryMap = {
      Comments: () => supabase.from('Comments').delete().eq('commentId', id),
      FilesComments: () => supabase.from('FilesComments').delete().eq('id', id),
      SubComments: () => supabase.from('SubComments').delete().eq('subCommentId', id),
      LastComments: () => supabase.from('LastComments').delete().eq('lastCommentId', id),
    };

    const { error } = await queryMap[tableName]().eq('authorId', author?.id!);
    return { message: error ? 'Failed to delete comment' : 'Comment was deleted', error: error?.message || '' };
  } catch (e: any) {
    console.error(e);
    return { message: '', error: e.message };
  }
};
