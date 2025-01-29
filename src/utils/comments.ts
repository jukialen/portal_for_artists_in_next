import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getCurrentLocale } from 'locales/server';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { giveRole } from './roles';

import { Database } from 'types/database.types';
import {
  CommentType,
  FilesCommentsType,
  LastCommentType,
  NewCommentsType,
  RoleType,
  SubCommentType,
  TableNameEnum,
} from 'types/global.types';
import { likeList } from './likes';

type DataArrayType = {
  subCommentId: string;
  content: string;
  roleId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string | null;
  Users: { id: string; pseudonym: string; profilePhoto: string | null } | null;
  Roles: { id: string; role: 'ADMIN' | 'MODERATOR' | 'USER' | 'AUTHOR' } | null;
};

const locale = getCurrentLocale();

const supabase = createServerComponentClient<Database>({ cookies });

const dataDateObject = dateData();

const likeRes = async (
  authorId: string,
  postId?: string,
  fileId?: string,
  commentId?: string,
  fileCommentId?: string,
  subCommentId?: string,
  lastCommentId?: string,
) => await likeList(authorId, postId, fileId, commentId, fileCommentId, subCommentId, lastCommentId);

//POST
export const newComment = async (commentData: NewCommentsType) => {
  const { content, authorId, postId, roleId, fileId, fileCommentId, commentId, subCommentId } = commentData;

  try {
    if (!!postId) {
      const { error } = await supabase.from('Comments').insert([
        {
          content,
          authorId,
          postId: postId!,
          roleId,
        },
      ]);

      if (!!error) {
        console.error(error);
        return { role: null };
      }
      return await giveRole(roleId);
    }

    if (!!fileId) {
      const { error } = await supabase.from('FilesComments').insert([
        {
          content: content!,
          authorId,
          fileId: fileId!,
          roleId,
        },
      ]);

      if (!!error) {
        console.error(error);
        return { role: null };
      }
      return await giveRole(roleId);
    }

    if (!!fileCommentId || !!commentId) {
      const { error } = await supabase.from('SubComments').insert([
        {
          content,
          authorId,
          commentId: commentId!,
          fileCommentId: fileCommentId!,
          roleId,
        },
      ]);

      if (!!error) {
        console.error(error);
        return { role: null };
      }
      return await giveRole(roleId);
    }

    if (!!subCommentId) {
      const { error } = await supabase.from('LastComments').insert([
        {
          content,
          authorId,
          subCommentId: subCommentId!,
          roleId,
        },
      ]);

      if (!!error) {
        console.error(error);
        return { role: null };
      }
      return await giveRole(roleId);
    }
  } catch (error) {
    console.error(error);
  }
};

//GET
const groupRole = async (groupsPostsRoleId: string, userId: string): Promise<RoleType | undefined> => {
  try {
    const { data, error } = await supabase
      .from('Roles')
      .select('role')
      .eq('id', groupsPostsRoleId)
      .eq('userId', userId)
      .limit(1)
      .single();

    !!error && console.error(error);

    return data?.role;
  } catch (e) {
    console.error(e);
  }
};

export const firstComments = async (postId: string, maxItems: number, groupsPostsRoleId: string) => {
  const commentArray: CommentType[] = [];

  try {
    const { data, error } = await supabase
      .from('Comments')
      .select('*')
      .eq('postId', postId)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

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
        likes: (await likeRes(authorId, postId)).likes,
        liked: (await likeRes(authorId, postId)).liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }

    return commentArray;
  } catch (e) {
    console.error(e);
  }
};

export const againComments = async (postId: string, maxItems: number, groupsPostsRoleId: string) => {
  const commentArray: CommentType[] = [];

  try {
    const { data, error } = await supabase
      .from('Comments')
      .select('*')
      .gt('postId', postId)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) {
      console.error(error);
      return commentArray;
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
        return commentArray;
      }

      commentArray.push({
        postId,
        commentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        likes: (await likeRes(authorId, postId)).likes,
        liked: (await likeRes(authorId, postId)).liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }

    return commentArray;
  } catch (e) {
    console.error(e);
  }
};

export const filesComments = async (fileId: string, maxItems: number) => {
  const userData = await getUserData();

  const filesArray: FilesCommentsType[] = [];

  try {
    const { data, error } = await supabase
      .from('FilesComments')
      .select(
        'id, fileId, content, roleId, Roles (role), authorId, createdAt, updatedAt, Users (pseudonym, profilePhoto)',
      )
      .eq('fileId', fileId)
      .order('createdAt', { ascending: false })
      .limit(maxItems);
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
        likes: (await likeRes(authorId, undefined, fileId)).likes,
        liked: (await likeRes(authorId, undefined, fileId)).liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
      });
    }

    return filesArray;
  } catch (error) {
    console.error(error);

    return filesArray;
  }
};

export const againFilesComments = async (fileId: string, maxItems: number) => {
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
      .limit(maxItems);
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
        likes: (await likeRes(authorId, undefined, fileId)).likes,
        liked: (await likeRes(authorId, undefined, fileId)).liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
      });
    }

    return filesArray;
  } catch (error) {
    console.error(error);

    return filesArray;
  }
};

export const subComments = async (
  maxItems: number,
  groupsPostsRoleId?: string,
  commentId?: string,
  fileCommentId?: string,
) => {
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
        .eq('commentId', commentId)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

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
        .limit(maxItems);

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
        commentId,
        fileCommentId,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: userData?.profilePhoto!,
        role: gRole!,
        roleId: !!commentId ? groupsPostsRoleId || roleId : roleId,
        authorId,
        likes: (await likeRes(authorId, undefined, undefined, commentId, fileCommentId)).likes,
        liked: (await likeRes(authorId, undefined, undefined, commentId, fileCommentId)).liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
        groupsPostsRoleId,
      });
    }

    return subArray;
  } catch (error) {
    console.error(error);

    return subArray;
  }
};

export const againSubComments = async (
  maxItems: number,
  lastVisible: string,
  groupsPostsRoleId?: string,
  commentId?: string,
  fileCommentId?: string,
) => {
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
        .limit(maxItems);

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
        .limit(maxItems);

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
        commentId,
        fileCommentId,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: userData?.profilePhoto!,
        role: gRole!,
        roleId: !!commentId ? groupsPostsRoleId || roleId : roleId,
        authorId,
        likes: (await likeRes(authorId, undefined, undefined, commentId, fileCommentId)).likes,
        liked: (await likeRes(authorId, undefined, undefined, commentId, fileCommentId)).liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
        groupsPostsRoleId,
      });
    }

    return subArray;
  } catch (error) {
    console.error(error);

    return subArray;
  }
};

export const firstLastComments = async (subCommentId: string, maxItems: number, groupsPostsRoleId: string) => {
  const lastCommentArray: LastCommentType[] = [];

  try {
    const { data, error } = await supabase
      .from('LastComments')
      .select('*')
      .eq('subCommentId', subCommentId)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) {
      console.error(error);
      return lastCommentArray;
    }

    for (const first of data!) {
      const { lastCommentId, subCommentId, content, roleId, authorId, createdAt, updatedAt } = first;

      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', authorId)
        .limit(1)
        .single();

      const role = await giveRole(groupsPostsRoleId || roleId);
      if (!!er || role === undefined) {
        console.error(er || 'role is undefined');
        return lastCommentArray;
      }

      lastCommentArray.push({
        lastCommentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        likes: (await likeRes(authorId, undefined, undefined, undefined, undefined, undefined, lastCommentId)).likes,
        liked: (await likeRes(authorId, undefined, undefined, undefined, undefined, undefined, lastCommentId)).liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
        subCommentId,
      });
    }

    return lastCommentArray;
  } catch (e) {
    console.error(e);
  }
};

export const againLastComments = async (subCommentId: string, maxItems: number, groupsPostsRoleId: string) => {
  const lastCommentArray: LastCommentType[] = [];

  try {
    const { data, error } = await supabase
      .from('LastComments')
      .select('*')
      .gt('subCommentId', subCommentId)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) {
      console.error(error);
      return lastCommentArray;
    }
    for (const next of data!) {
      const { lastCommentId, subCommentId, content, roleId, authorId, createdAt, updatedAt } = next;
      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', authorId)
        .limit(1)
        .single();

      const role = await giveRole(groupsPostsRoleId || roleId);
      if (!!er || role === undefined) {
        console.error(er || 'role is undefined');
        return lastCommentArray;
      }

      lastCommentArray.push({
        lastCommentId,
        subCommentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        likes: (await likeRes(authorId, undefined, undefined, undefined, undefined, undefined, lastCommentId)).likes,
        liked: (await likeRes(authorId, undefined, undefined, undefined, undefined, undefined, lastCommentId)).liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }

    return lastCommentArray;
  } catch (e) {
    console.error(e);
  }
};

//PATCH

export const updComment = async (
  tableName: TableNameEnum,
  nameId: 'commentId' | 'fileId' | 'fileCommentId' | 'subCommentId' | 'lastCommentId',
  id: string,
  content: string,
) => {
  try {
    const { error } = await supabase.from(tableName).insert([{ content }]).eq(nameId, id);

    return !error;
  } catch (e) {
    console.error(e);
  }
};

///DELETE

export const delComment = async (
  tableName: TableNameEnum,
  nameId: 'commentId' | 'fileId' | 'fileCommentId' | 'subCommentId' | 'lastCommentId',
  id: string,
) => {
  try {
    const { error } = await supabase.from(tableName).delete().eq(nameId, id);

    return !error;
  } catch (e) {
    console.error(e);
  }
};
