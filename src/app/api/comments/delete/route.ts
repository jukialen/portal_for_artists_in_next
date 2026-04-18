import { NextRequest, NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

import { TableNameType } from 'types/global.types';

type DelCommentType = {
  tableName: TableNameType;
  nameId: 'commentId' | 'fileId' | 'fileCommentId' | 'subCommentId' | 'lastCommentId';
  id: string;
};

export async function DELETE(req: NextRequest) {
  const supabase = await createServer();

  try {
    const { tableName, nameId, id }: DelCommentType = await req.json();

    const { data, error } = await supabase.from(tableName).delete().eq(nameId, id).select('id');

    const deletedCount = data?.length ?? 0;

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
