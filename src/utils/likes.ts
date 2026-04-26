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
): Promise<Like | null> => {
  try {
    const params = {
      postId: postId!,
      fileId: fileId!,
      fileCommentId: fileCommentId!,
      commentId: commentId!,
      authorId,
      subCommentId: subCommentId!,
      lastCommentId: lastCommentId!,
    };
    const queryString = new URLSearchParams(params).toString();

    const likesConst: {
      likes: number;
      liked: boolean;
    } = await fetch(`${backUrl}/api/likes/list?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error(e);
        return null;
      });

    return likesConst;
  } catch (e) {
    console.error(e);
    return null;
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
      })
        .then((r) => r.json())
        .catch((e) => {
          console.error(e);
          return null;
        });
    } else {
      const params = {
        postId: postId!,
        fileId: fileId!,
        authorId,
      };
      const queryString = new URLSearchParams(params).toString();

      return await fetch(`${backUrl}/api/likes/toggle?${queryString}`, {
        method: 'DELETE',
      })
        .then((r) => r.json())
        .catch((e) => {
          console.error(e);
          return null;
        });
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};
