import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from 'types/database.types';
import { NextRequest } from 'next/server';

const supabase = createServerComponentClient<Database>({ cookies });

type PostType = {
  postId: string;
  authorId: string;
  fileId: string;
};
export default async function handler(req: NextApiRequest | NextRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const requestBody: PostType = await new Promise((resolve, reject) => {
      let body = '';
      if (!(req instanceof NextRequest)) {
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
      }
    });

    const { postId, authorId, fileId } = requestBody;

    const { error } = await supabase.from('Liked').insert([{ postId, userId: authorId, fileId }]);

    return !error;
  } else if (req.method === 'DELETE') {
    const { searchParams } = new URL(req.url!);
    const postId = searchParams.get('postId')!;
    const fileId = searchParams.get('fileId')!;
    const authorId = searchParams.get('authorId')!;

    const { error } = await supabase
      .from('Liked')
      .delete()
      .eq(!!postId ? 'postId' : 'fileId', postId || fileId!)
      .eq('userId', authorId);

    return !error;
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
