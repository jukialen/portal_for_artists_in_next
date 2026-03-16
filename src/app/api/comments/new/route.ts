import { NextRequest, NextResponse } from 'next/server';

import { giveRole } from 'utils/roles';
import { createServer } from 'utils/supabase/clientSSR';

import { CommentType, FilesCommentsType, RoleType, SubCommentType } from 'types/global.types';

export async function POST(req: NextRequest) {
  let role: RoleType | undefined;

  try {
    const supabase = await createServer();

    const requestBody: CommentType & FilesCommentsType & SubCommentType = await req.json();

    const { content, authorId, postId, roleId, fileId, fileCommentId, commentId, subCommentId } = requestBody;

    console.log('new con data', content, authorId, postId, roleId, fileId, fileCommentId, commentId, subCommentId);

    if (roleId === 'no id') return NextResponse.json({ error: 'no role id', message: '' });

    if (!!postId) {
      const { error } = await supabase.from('Comments').insert([{ content, authorId, postId, roleId: roleId! }]);

      if (!!error) {
        console.error(error);
        return NextResponse.json({ error: 'no post id', message: '' });
      }
    }

    if (!!fileId) {
      const { error } = await supabase.from('FilesComments').insert([{ content, authorId, fileId, roleId: roleId! }]);

      if (!!error) {
        console.error('fileId error', error);
        return NextResponse.json({ error: 'no file id', message: '' });
      }
    }

    if (!!fileCommentId || !!commentId) {
      const { error } = await supabase
        .from('SubComments')
        .insert([{ content, authorId, commentId, fileCommentId, roleId: roleId! }]);

      if (!!error) {
        console.error(error);
        return NextResponse.json({ error: 'no second nested comment id', message: '' });
      }
    }

    if (!!subCommentId) {
      const { error } = await supabase
        .from('LastComments')
        .insert([{ content, authorId, subCommentId, roleId: roleId! }]);

      if (!!error) {
        console.error(error);
        return NextResponse.json({ error: 'no last nested comment id', message: '' });
      }
    }

    role = await giveRole(roleId!);
    return NextResponse.json({ error: '', message: role });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid request body' });
  }
}
