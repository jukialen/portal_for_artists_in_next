import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from 'types/database.types';
import { TableNameEnum } from 'types/global.types';

type DelCommentType = {
  tableName: TableNameEnum;
  nameId: 'commentId' | 'fileId' | 'fileCommentId' | 'subCommentId' | 'lastCommentId';
  id: string;
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    const requestBody: DelCommentType = await new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk: Buffer) => {
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

    const { tableName, nameId, id } = requestBody;

    const { error } = await supabase.from(tableName).delete().eq(nameId, id);

    return !error;
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Invalid request body' });
  }
}
