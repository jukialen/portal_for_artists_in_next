import { NextRequest, NextResponse } from 'next/server';
import { createServer } from 'utils/supabase/clientSSR';

import { TableNameType } from 'types/global.types';
import { getUserData } from 'helpers/getUserData';

type UpdateCommentType = {
  tableName: TableNameType;
  nameId: 'commentId' | 'fileId' | 'fileCommentId' | 'subCommentId' | 'lastCommentId';
  id: string;
  content: string;
  authorId: string;
};

export async function PATCH(req: NextRequest) {
  const supabase = await createServer();
  const authorId = await getUserData().then((user) => user?.id!);

  try {
    const requestBody: UpdateCommentType = await req.json();

    const { tableName, nameId, id, content } = requestBody;
    console.log('updateComment request', tableName, nameId, id, content);

    const { data, error } = await supabase
      .from(tableName)
      .update({ content })
      .eq(nameId, id)
      .eq('authorId', authorId)
      .select();
    console.log('updateComment error', error);
    console.log('updateComment data', data);

    return NextResponse.json(!!error);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Invalid request body' });
  }
}
