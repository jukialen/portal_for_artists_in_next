import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getCurrentLocale } from 'locales/server';

import { backUrl } from 'constants/links';
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

const locale = getCurrentLocale();

const supabase = createServerComponentClient<Database>({ cookies });

//POST
export const newComment = async (commentData: NewCommentsType) => {
  try {
    const role: RoleType = await fetch(`${backUrl}/${locale}/api/comments/new`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    }).then((r) => r.json());

    return role;
  } catch (e) {
    console.error(e);
  }
};

//GET
export const groupRole = async (groupsPostsRoleId: string, userId: string): Promise<RoleType | undefined> => {
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

export const comments = async (
  postId: string,
  maxItems: number,
  groupsPostsRoleId: string,
  step: 'first' | 'again',
) => {
  const params = { postId, maxItems: maxItems.toString(), groupsPostsRoleId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: CommentType[] = await fetch(`${backUrl}/${locale}/api/comments/${step}?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
  } catch (e) {
    console.error(e);
  }
};

export const filesComments = async (fileId: string, maxItems: number, step: 'first' | 'again') => {
  const params = { fileId, maxItems: maxItems.toString() };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: FilesCommentsType[] = await fetch(`${backUrl}/${locale}/api/files-comments/${step}?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
  } catch (e) {
    console.error(e);
  }
};

export const subComments = async (
  maxItems: number,
  step: 'first' | 'again',
  groupsPostsRoleId?: string,
  commentId?: string,
  fileCommentId?: string,
  lastVisible?: string,
) => {
  const params = {
    groupsPostsRoleId: groupsPostsRoleId!,
    commentId: commentId!,
    fileCommentId: fileCommentId!,
    maxItems: maxItems.toString(),
  };

  const lastParams = {
    ...params,
    lastVisible: lastVisible!,
  };
  const queryString = new URLSearchParams(!!lastParams ? lastParams : params).toString();

  try {
    const res: SubCommentType[] = await fetch(`${backUrl}/${locale}/api/sub-comments/${step}?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
  } catch (e) {
    console.error(e);
  }
};

export const lastComments = async (
  subCommentId: string,
  maxItems: number,
  groupsPostsRoleId: string,
  step: 'first' | 'again',
) => {
  const params = { subCommentId, maxItems: maxItems.toString(), groupsPostsRoleId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: LastCommentType[] = await fetch(`${backUrl}/${locale}/api/last-comments/${step}?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
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
    const up: boolean = await fetch(`${backUrl}/api/comments/update`, {
      method: 'PATCH',
      body: JSON.stringify({ tableName, nameId, id, content }),
    }).then((r) => r.json());

    return up;
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
    const del: boolean = await fetch(`${backUrl}/api/comments/update`, {
      method: 'DELETE',
      body: JSON.stringify({ tableName, nameId, id }),
    }).then((r) => r.json());

    return del;
  } catch (e) {
    console.error(e);
  }
};
