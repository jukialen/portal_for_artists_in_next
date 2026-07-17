import { NextRequest, NextResponse } from 'next/server';

import { giveRole } from 'utils/server/roles';
import { createServer } from 'utils/supabase/clientSSR';

import { CommentType, FilesCommentsType, RoleType, SubCommentType } from 'types/global.types';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createServer();

    const requestBody: CommentType & FilesCommentsType & SubCommentType = await req.json();

    console.log('comment api', requestBody);

    const { content, authorId, postId, roleId, fileId, fileCommentId, commentId, subCommentId } = requestBody;

    if (roleId === 'no id') return NextResponse.json({ role: '', message: 'no role id' });

    if (!!postId) {
      const { error } = await supabase.from('Comments').insert([{ content, authorId, postId, roleId: roleId! }]);

      if (!!error) {
        console.error(error);
        return NextResponse.json({ role: '', message: 'no post id' });
      }
    }

    if (!!fileId) {
      console.log('fileId', fileId);
      const { error } = await supabase.from('FilesComments').insert([{ content, authorId, fileId, roleId: roleId! }]);

      if (!!error) {
        console.error('fileId error', error);
        return NextResponse.json({ role: '', message: 'no file id' });
      }
    }

    if (!!fileCommentId || !!commentId) {
      const { error } = await supabase
        .from('SubComments')
        .insert([{ content, authorId, commentId, fileCommentId, roleId: roleId! }]);

      if (!!error) {
        console.error(error);
        return NextResponse.json({ role: '', message: 'no second nested comment id' });
      }
    }

    if (!!subCommentId) {
      const { error } = await supabase
        .from('LastComments')
        .insert([{ content, authorId, subCommentId, roleId: roleId! }]);

      if (!!error) {
        console.error(error);
        return NextResponse.json({ role: '', message: 'no last nested comment id' });
      }
    }

    const { role, message }: { role: RoleType | ''; message: string } = await giveRole(roleId!);
    console.log('{ role, message }', { role, message });
    return NextResponse.json({ role, message });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ role: '', message: 'Invalid request body' });
  }
}
