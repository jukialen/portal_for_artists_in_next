import { NextRequest, NextResponse } from 'next/server';
import { createServer } from 'utils/supabase/clientSSR';
import { sendLokiLog } from 'helpers/Grafana/server/methods';
import { getTraceId } from 'helpers/getHeaders';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const authorId = searchParams.get('authorId');
  const params = ['postId', 'fileId', 'fileCommentId', 'commentId', 'subCommentId', 'lastCommentId'];

  const activeParam = params.find((p) => searchParams.has(p));

  if (!activeParam) return NextResponse.json({ likes: 0, liked: false, idLiked: '' });

  try {
    const supabase = await createServer();
    let query = supabase.from('Liked').select('id, userId').eq(activeParam, searchParams.get(activeParam)!);

    if (params.includes(activeParam)) query = query.eq('userId', authorId!);

    const { data, error } = await query;
    if (error) await sendLokiLog(error.message, await getTraceId(), 'error');

    return NextResponse.json({
      idLiked: data?.find((d) => d.userId === authorId)?.id || '',
      likes: data?.length || 0,
      liked: data?.some((d) => d.userId === authorId) || false,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ idLiked: '', likes: 0, liked: false });
  }
}
