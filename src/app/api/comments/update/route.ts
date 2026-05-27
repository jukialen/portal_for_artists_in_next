import { NextRequest, NextResponse } from 'next/server';

import { getUserData } from 'helpers/getUserData';
import { createServer } from 'utils/supabase/clientSSR';

import { TableNameType } from 'types/global.types';

type UpdateCommentType = { tableName: TableNameType; id: string; content: string };

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createServer();
    const { tableName, id, content }: UpdateCommentType = await req.json();
    const authorId = await getUserData().then((user) => user?.id!);

    const queryMap = {
      Comments: () => supabase.from('Comments').update({ content }).eq('commentId', id),
      FilesComments: () => supabase.from('FilesComments').update({ content }).eq('id', id),
      SubComments: () => supabase.from('SubComments').update({ content }).eq('subCommentId', id),
      LastComments: () => supabase.from('LastComments').update({ content }).eq('lastCommentId', id),
    };

    const { error } = await queryMap[tableName]().eq('authorId', authorId);

    return NextResponse.json(!!error);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Invalid request body' });
  }
}
