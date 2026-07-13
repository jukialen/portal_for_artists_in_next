'use server';

//SELECT
import { backUrl } from 'constants/links';
import { Like } from 'types/global.types';

export const likeList = async (
  authorId: string,
  postId?: string,
  fileId?: string,
  commentId?: string,
  fileCommentId?: string,
  subCommentId?: string,
  lastCommentId?: string,
): Promise<Like> => {
  try {
    const params = { postId, fileId, fileCommentId, commentId, authorId, subCommentId, lastCommentId };
    const validParams = Object.entries(params).filter(([_, value]) => value != null) as [string, string][];
    const queryString = new URLSearchParams(validParams).toString();

    return await fetch(`${backUrl}/api/likes/list?${queryString}`, { method: 'GET' }).then((r) => r.json());
  } catch (e) {
    console.error(e);
    return {
      idLiked: '',
      likes: 0,
      liked: false,
    };
  }
};

//PATCH && DELETE
export const toggleLiked = async (is: boolean, authorId: string, postId?: string, fileId?: string): Promise<any> => {
  try {
    if (is) {
      return await fetch(`${backUrl}/api/likes/toggle`, {
        method: 'POST',
        body: JSON.stringify({
          postId: postId!,
          fileId: fileId!,
          authorId,
        }),
      }).then((r) => r.json());
    } else {
      const params = {
        postId: postId!,
        fileId: fileId!,
        authorId,
      };
      const queryString = new URLSearchParams(params).toString();

      return await fetch(`${backUrl}/api/likes/toggle?${queryString}`, {
        method: 'DELETE',
      }).then((r) => r.json());
    }
  } catch (e) {
    console.error(e);
    return { idLiked: '', likes: 0, liked: false };
  }
};
