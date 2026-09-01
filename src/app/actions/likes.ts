'use server';

import { ColumnCommentsTableNameType, Like } from 'types/global.types';
import { sendLokiLog } from 'helpers/Grafana/server/methods';
import { getTraceId } from 'helpers/getHeaders';
import { createServer } from 'utils/supabase/clientSSR';

interface ToggleLikedType {
  is: boolean;
  authorId: string;
  postId?: string | null;
  fileId?: string | null;
  commentId?: string | null;
  subCommentId?: string | null;
  fileCommentId?: string | null;
}

export const likeList = async (
  authorId: string,
  columnName: ColumnCommentsTableNameType,
  columnValue: string,
): Promise<Like> => {
  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Liked')
      .select('id, userId')
      .eq(columnName, columnValue!)
      .eq('userId', authorId!);

    if (error) await sendLokiLog(error.message, await getTraceId(), 'error');

    return {
      idLiked: data?.find((d) => d.userId === authorId)?.id || '',
      likes: data?.length || 0,
      liked: data?.some((d) => d.userId === authorId) || false,
    };
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
export const toggleLiked = async ({
  is,
  authorId,
  postId = null,
  fileId = null,
  commentId = null,
  subCommentId = null,
  fileCommentId = null,
}: ToggleLikedType): Promise<{ changed: boolean; idLiked: string | null }> => {
  try {
    const supabase = await createServer();

    if (is) {
      if (!authorId || !postId || !fileId || !commentId || !subCommentId || !fileCommentId) {
        await sendLokiLog(
          'Missing required parameters: authorId and either postId or fileId',
          await getTraceId(),
          'error',
        );
        return { changed: false, idLiked: null };
      }

      const { error } = await supabase
        .from('Liked')
        .delete()
        .eq(!!postId ? 'postId' : 'fileId', postId || fileId!)
        .eq('userId', authorId);

      if (error) {
        await sendLokiLog(error?.message, await getTraceId(), 'error');

        return { changed: false, idLiked: null };
      }

      return { changed: true, idLiked: null };
    } else {
      const { data, error } = await supabase
        .from('Liked')
        .insert([{ postId, userId: authorId, fileId, commentId, subCommentId, fileCommentId }])
        .select('id')
        .limit(1)
        .maybeSingle();

      if (error) {
        await sendLokiLog('Failed to like item', await getTraceId(), 'error');
        return { changed: false, idLiked: null };
      }

      return { changed: true, idLiked: data?.id! };
    }
  } catch (e) {
    console.error(e);
    return { changed: false, idLiked: null };
  }
};
