'use server';

import { backUrl } from 'constants/links';
import {
  CommentType,
  FilesCommentsType,
  LastCommentType,
  NewCommentsType,
  RoleType,
  SubCommentType,
  TableNameType,
} from 'types/global.types';
import { createServer } from './supabase/clientSSR';
import { likeList } from './likes';
import { getDate } from '../helpers/getDate';
import { getUserData } from '../helpers/getUserData';

//POST
export const newComment = async (commentData: NewCommentsType): Promise<{ role: RoleType | ''; message: string }> => {
  try {
    const { role, message }: { role: RoleType | ''; message: string } = await fetch(`${backUrl}/api/comments/new`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    }).then((r) => r.json());

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
  step: 'first' | 'again',
): Promise<CommentType[]> => {
  const params = { postId, maxItems: maxItems.toString(), groupsPostsRoleId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: CommentType[] = await fetch(`${backUrl}/api/comments/${step}?${queryString}`, {
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
      authorId: string;
      createdAt: string;
      updatedAt: string | null;
    }[];

    if (stage === 'first') {
      const { data, error } = await supabase
        .from('FilesComments')
        .select('id, fileId, content, roleId, authorId, createdAt, updatedAt')
        .eq('fileId', fileId)
        .order('createdAt', { ascending: false })
        .limit(Number(maxItems));

      if (!data || data?.length === 0 || !!error) return filesArray;
      commentsData = data;
    } else {
      const { data, error } = await supabase
        .from('FilesComments')
        .select(
          'id, fileId, content, roleId, Roles (role), authorId, createdAt, updatedAt, Users (pseudonym, profilePhoto)',
        )
        .gt('fileId', fileId)
        .order('createdAt', { ascending: false })
        .limit(Number(maxItems));
      if (!data || data?.length === 0 || !!error) return filesArray;

      commentsData = data;
    }
    const userData = await getUserData();

    for (const d of commentsData) {
      const { id: fileCommentId, fileId, content, roleId, authorId, createdAt, updatedAt } = d;

      filesArray.push({
        fileCommentId,
        fileId,
        content,
        authorName: '',
        authorProfilePhoto: userData?.profilePhoto!,
        role: 'USER',
        roleId,
        authorId,
        likes: (await likeList(authorId, 'fileCommentId', fileCommentId)).likes,
        liked: (await likeList(authorId, 'fileCommentId', fileCommentId)).liked,
        idLiked: (await likeList(authorId, 'fileCommentId', fileCommentId)).idLiked,
        date: await getDate(updatedAt! || createdAt!),
      });
    }

    return filesArray;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const subComments = async (
  maxItems: number,
  step: 'first' | 'again',
  groupsPostsRoleId?: string,
  commentId?: string,
  fileCommentId?: string,
  lastVisible?: string,
): Promise<SubCommentType[]> => {
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
    const res: SubCommentType[] = await fetch(`${backUrl}/api/sub-comments/${step}?${queryString}`, {
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

export const updComment = async (tableName: TableNameType, id: string, content: string): Promise<boolean> => {
  console.log('updateComment called', tableName, id, content);
  try {
    const up: boolean = await fetch(`${backUrl}/api/comments/update`, {
      method: 'PATCH',
      body: JSON.stringify({ tableName, id, content }),
    }).then((r) => r.json());

    console.log('updateComment result', up);
    return up;
  } catch (e) {
    console.error(e);
    return false;
  }
};

///DELETE
export const delComment = async (tableName: TableNameType, id: string): Promise<{ message: string; error: string }> => {
  try {
    const { message, error }: { message: string; error: string } = await fetch(`${backUrl}/api/comments/delete`, {
      method: 'DELETE',
      body: JSON.stringify({ tableName, id }),
    }).then((r) => r.json());

    console.log('deleteComment result', message, error);
    return { message, error };
  } catch (e: any) {
    console.error(e);
    return { message: '', error: e.message };
  }
};
