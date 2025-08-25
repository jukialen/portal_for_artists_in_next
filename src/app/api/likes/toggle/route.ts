import { NextRequest, NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

type PostType = {
  postId: string;
  authorId: string;
  fileId: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createServer();

  try {
    const requestBody: PostType = await req.json();
    const { postId, authorId, fileId } = requestBody;

    const { error } = await supabase.from('Liked').insert([{ postId, userId: authorId, fileId }]);

    if (error) {
      console.error('Supabase POST error:', error);
      return NextResponse.json({ message: 'Failed to like item', error: error.message }, { status: 500 });
    }

    return NextResponse.json(!error);
  } catch (e) {
    console.error('Error in POST handler:', e);
    return NextResponse.json({ message: 'Invalid request body or internal server error' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServer();

  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const fileId = searchParams.get('fileId');
    const authorId = searchParams.get('authorId');

    if (!authorId || (!postId && !fileId)) {
      return NextResponse.json(
        { message: 'Missing required parameters: authorId and either postId or fileId' },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from('Liked')
      .delete()
      .eq(!!postId ? 'postId' : 'fileId', postId || fileId!)
      .eq('userId', authorId);

    if (error) {
      console.error('Supabase DELETE error:', error);
      return NextResponse.json(!!error);
    }

    return NextResponse.json(!error);
  } catch (e) {
    console.error('Error in DELETE handler:', e);
    return NextResponse.json(!!e);
  }
}
