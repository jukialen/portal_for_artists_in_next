import { NextRequest, NextResponse } from 'next/server';
import { createServer } from 'utils/supabase/clientSSR';

import { TableNameType } from 'types/global.types';

type UpdateCommentType = {
  tableName: TableNameType;
  nameId: 'commentId' | 'fileId' | 'fileCommentId' | 'subCommentId' | 'lastCommentId';
  id: string;
  content: string;
  authorId: string;
};

export async function PATCH(req: NextRequest) {
  const supabase = await createServer();

  try {
    const requestBody: UpdateCommentType = await req.json();

    const { tableName, nameId, id, content } = requestBody;

    const { error } = await supabase.from(tableName).update({ content }).eq(nameId, id);

    return NextResponse.json(!error);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Invalid request body' });
  }
}
