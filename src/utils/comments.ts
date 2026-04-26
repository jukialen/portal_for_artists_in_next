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

//POST
export const newComment = async (
  commentData: NewCommentsType,
): Promise<{ role: RoleType | ''; message: string }> => {
  try {
    const { role, message }: { role: RoleType | ''; message: string } = await fetch(
      `${backUrl}/api/comments/new`,
      {
        method: 'POST',
        body: JSON.stringify(commentData),
      },
    ).then((r) => r.json());

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

export const filesAgainComments = async (
  fileId: string,
  maxItems: number,
  stage: 'first' | 'again' = 'first',
): Promise<FilesCommentsType[]> => {
  const params = { fileId, maxItems: maxItems.toString() };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: FilesCommentsType[] = await fetch(
      `${backUrl}/api/files-comments/${stage}?${queryString}`,
      {
        method: 'GET',
        credentials: 'include',
        cache: 'reload',
      },
    )
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

export const updComment = async (
  tableName: TableNameType,
  nameId: 'commentId' | 'id' | 'fileCommentId' | 'subCommentId' | 'lastCommentId',
  id: string,
  content: string,
): Promise<boolean> => {
  console.log('updateComment called', tableName, nameId, id, content);
  try {
    const up: boolean = await fetch(`${backUrl}/api/comments/update`, {
      method: 'PATCH',
      body: JSON.stringify({ tableName, nameId, id, content }),
    }).then((r) => r.json());

    console.log('updateComment result', up);
    return up;
  } catch (e) {
    console.error(e);
    return false;
  }
};

///DELETE
export const delComment = async (
  tableName: TableNameType,
  nameId: 'commentId' | 'id' | 'fileCommentId' | 'subCommentId' | 'lastCommentId',
  id: string,
): Promise<{ message: string; error: string }> => {
  try {
    const { message, error }: { message: string; error: string } = await fetch(
      `${backUrl}/api/comments/delete`,
      {
        method: 'DELETE',
        body: JSON.stringify({ tableName, nameId, id }),
      },
    ).then((r) => r.json());

    console.log('deleteComment result', message, error);
    return { message, error };
  } catch (e: any) {
    console.error(e);
    return { message: '', error: e.message };
  }
};
