//SELECT
import { backUrl } from '../constants/links';

export const likeList = async (
  authorId: string,
  postId?: string,
  fileId?: string,
  commentId?: string,
  fileCommentId?: string,
  subCommentId?: string,
  lastCommentId?: string,
) => {
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
    } = await fetch(`${backUrl}/en/api/likes/list?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return likesConst;
  } catch (e) {
    console.error(e);
  }
};

//PATCH && DELETE
export const toggleLiked = async (is: boolean, authorId: string, postId?: string, fileId?: string) => {
  try {
    if (is) {
      const status: boolean = await fetch(`${backUrl}/en/api/likes/toggle`, {
        method: 'POST',
        body: JSON.stringify({
          postId: postId!,
          fileId: fileId!,
          authorId,
        }),
      })
        .then((r) => r.json())
        .catch((e) => console.error(e));

      return !status;
    } else {
      const params = {
        postId: postId!,
        fileId: fileId!,
        authorId,
      };
      const queryString = new URLSearchParams(params).toString();

      const status: boolean = await fetch(`${backUrl}/en/api/likes/toggle?${queryString}`, {
        method: 'DELETE',
      })
        .then((r) => r.json())
        .catch((e) => console.error(e));

      return status;
    }
  } catch (e) {
    console.error(e);
  }
};
