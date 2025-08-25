import { NextRequest, NextResponse } from 'next/server'; // Zmieniony import

import { createServer } from 'utils/supabase/clientSSR';

import { TableNameType } from 'types/global.types';

type DelCommentType = {
  tableName: TableNameType;
  nameId: 'commentId' | 'fileId' | 'fileCommentId' | 'subCommentId' | 'lastCommentId';
  id: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createServer();

  try {
    const requestBody: DelCommentType = await req.json();

    const { tableName, nameId, id } = requestBody;

    const { error } = await supabase.from(tableName).delete().eq(nameId, id);

    if (error) {
      return NextResponse.json({ message: 'Failed to delete comment', error: error.message }, { status: 500 });
    }

    return NextResponse.json(!error);
  } catch (e) {
    console.error('Error in POST handler:', e);
    return NextResponse.json({ message: 'Invalid request body or internal server error' }, { status: 400 });
  }
}
