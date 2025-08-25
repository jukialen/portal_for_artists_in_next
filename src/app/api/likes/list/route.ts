import { NextRequest, NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  const fileId = searchParams.get('fileId');
  const fileCommentId = searchParams.get('fileCommentId');
  const commentId = searchParams.get('commentId');
  const authorId = searchParams.get('authorId')!;
  const subCommentId = searchParams.get('subCommentId');
  const lastCommentId = searchParams.get('lastCommentId');

  const likesConst: { authorId: string }[] = [];
  let e;
  let res;

  try {
    const supabase = await createServer();

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
      return NextResponse.json({
        likes: 0,
        liked: false,
      });
    }

    for (const d of res!) {
      likesConst.push({
        authorId: d.userId,
      });
    }

    return NextResponse.json({
      likes: likesConst.length,
      liked: likesConst.includes({ authorId }, 0),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      likes: 0,
      liked: false,
    });
  }
}
