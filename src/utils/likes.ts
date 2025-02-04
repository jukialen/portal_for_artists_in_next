import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from 'types/database.types';

const supabase = createServerComponentClient<Database>({ cookies });

//SELECT
export const likeList = async (
  authorId: string,
  postId?: string,
  fileId?: string,
  commentId?: string,
  fileCommentId?: string,
  subCommentId?: string,
  lastCommentId?: string,
) => {
  const likesConst: { authorId: string }[] = [];
  let e;
  let res;

  try {
    if (!!postId || !!fileId) {
      const { data, error } = await supabase
        .from('Liked')
        .select()
        .eq(!!postId ? 'postId' : 'fileId', postId || fileId!);

      e = error;
      res = data;
    }

    if (!!fileCommentId || !!commentId) {
      const { data, error } = await supabase
        .from('Liked')
        .select()
        .eq('userId', authorId)
        .eq(!!fileCommentId ? 'fileCommentId' : 'commentId', fileCommentId || commentId!);

      e = error;
      res = data;
    }

    if (!!subCommentId || !!lastCommentId) {
      const { data, error } = await supabase
        .from('Liked')
        .select()
        .eq('userId', authorId)
        .eq(!!subCommentId ? 'subCommentId' : 'lastCommentId', subCommentId || lastCommentId!);

      e = error;
      res = data;
    }

    if (!!e) {
      console.error(e);
      return {
        likes: 0,
        liked: false,
      };
    }

    for (const d of res!) {
      likesConst.push({
        authorId: d.userId,
      });
    }

    return {
      likes: likesConst.length,
      liked: likesConst.includes({ authorId }, 0),
    };
  } catch (e) {
    console.error(e);
  }
};

//PATCH && DELETE
export const toggleLiked = async (is: boolean, authorId: string, postId?: string, fileId?: string) => {
  try {
    if (is) {
      const { error } = await supabase.from('Liked').insert([{ postId, userId: authorId, fileId }]);

      return !error;
    } else {
      const { error } = await supabase
        .from('Liked')
        .delete()
        .eq(!!postId ? 'postId' : 'fileId', postId || fileId!)
        .eq('userId', authorId);

      return !error;
    }
  } catch (e) {
    console.error(e);
  }
};
