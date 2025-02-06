import { NextApiRequest, NextApiResponse } from 'next';

import { giveRole } from 'utils/roles';
import { createServer } from 'utils/supabase/clientSSR';

import { CommentType, FilesCommentsType, RoleType, SubCommentType } from 'types/global.types';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  let role: RoleType | undefined;

  try {
    const supabase = await createServer();

    const requestBody: CommentType & FilesCommentsType & SubCommentType = await new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });

    const { content, authorId, postId, roleId, fileId, fileCommentId, commentId, subCommentId } = requestBody;

    if (!!postId) {
      const { error } = await supabase.from('Comments').insert([
        {
          content: content!,
          authorId: authorId!,
          postId: postId!,
          roleId: roleId!,
        },
      ]);

      if (!!error) {
        console.error(error);
        return null;
      }
      role = await giveRole(roleId!);
    }

    if (!!fileId) {
      const { error } = await supabase.from('FilesComments').insert([
        {
          content: content!,
          authorId: authorId!,
          fileId: fileId!,
          roleId: roleId!,
        },
      ]);

      if (!!error) {
        console.error(error);
        return null;
      }
      role = await giveRole(roleId!);
    }

    if (!!fileCommentId || !!commentId) {
      const { error } = await supabase.from('SubComments').insert([
        {
          content: content!,
          authorId: authorId!,
          commentId: commentId!,
          fileCommentId: fileCommentId!,
          roleId: roleId!,
        },
      ]);

      if (!!error) {
        console.error(error);
        return null;
      }
      role = await giveRole(roleId!);
    }

    if (!!subCommentId) {
      const { error } = await supabase.from('LastComments').insert([
        {
          content: content!,
          authorId: authorId!,
          subCommentId: subCommentId!,
          roleId: roleId!,
        },
      ]);

      if (!!error) {
        console.error(error);
        return null;
      }
      role = await giveRole(roleId!);

      return role;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid request body' });
  }
}
