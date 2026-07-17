'use server';

//SELECT
import { backUrl } from 'constants/links';
import { Like } from 'types/global.types';
import { sendLokiLog } from '../helpers/Grafana/server/methods';
import { getTraceId } from '../helpers/getHeaders';
import { createServer } from './supabase/clientSSR';
import { NextResponse } from 'next/server';

type ColumnNameType = 'postId' | 'fileId' | 'fileCommentId' | 'commentId' | 'subCommentId' | 'lastCommentId';

export const likeList = async (authorId: string, columnName: ColumnNameType, columnValue: string): Promise<Like> => {
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
export const toggleLiked = async (is: boolean, authorId: string, postId?: string, fileId?: string): Promise<any> => {
  try {
    const supabase = await createServer();

    if (is) {
      const { error } = await supabase.from('Liked').insert([{ postId, userId: authorId, fileId }]);

      if (error) {
        await sendLokiLog('Failed to like item', await getTraceId(), 'error');
        return !!error;
      }

      return !error;
    } else {
      if (!authorId || (!postId && !fileId)) {
        await sendLokiLog(
          'Missing required parameters: authorId and either postId or fileId',
          await getTraceId(),
          'error',
        );
        return !authorId || (!postId && !fileId);
      }

      const { error } = await supabase
        .from('Liked')
        .delete()
        .eq(!!postId ? 'postId' : 'fileId', postId || fileId!)
        .eq('userId', authorId);

      if (error) {
        await sendLokiLog(error?.message, await getTraceId(), 'error');

        return !!error;
      }

      return !error;
    }
  } catch (e) {
    console.error(e);
    return { idLiked: '', likes: 0, liked: false };
  }
};
