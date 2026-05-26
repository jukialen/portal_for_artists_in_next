import { NextRequest, NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

import { TableNameType } from 'types/global.types';

type DelCommentType = {
  tableName: TableNameType;
  nameId: 'authorId' | 'roleId';
  id: string;
};
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createServer();
    const { tableName, nameId, id }: DelCommentType = await req.json();

    const { error } = await supabase.from(tableName).delete().eq(nameId, id).select('id');

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
