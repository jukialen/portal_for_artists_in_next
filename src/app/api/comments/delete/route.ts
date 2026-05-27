import { NextRequest, NextResponse } from 'next/server';

import { getUserData } from 'helpers/getUserData';
import { createServer } from 'utils/supabase/clientSSR';

import { TableNameType } from 'types/global.types';

type DelCommentType = { tableName: TableNameType; id: string };

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createServer();
    const { tableName, id }: DelCommentType = await req.json();
    const authorId = await getUserData().then((user) => user?.id!);

    const queryMap = {
      Comments: () => supabase.from('Comments').delete().eq('commentId', id),
      FilesComments: () => supabase.from('FilesComments').delete().eq('id', id),
      SubComments: () => supabase.from('SubComments').delete().eq('subCommentId', id),
      LastComments: () => supabase.from('LastComments').delete().eq('lastCommentId', id),
    };

    const { error } = await queryMap[tableName]().eq('authorId', authorId);
    return NextResponse.json(
      { message: error ? 'Failed to delete comment' : 'Comment was deleted', error: error?.message || '' },
      { status: error ? 500 : 200 },
    );
  } catch (e) {
    console.error('Error in DELETE handler:', e);
    return NextResponse.json(
      {
        message: 'Invalid request body or internal server error',
        error: 'Invalid request body or internal server error',
      },
      { status: 400 },
    );
  }
}
