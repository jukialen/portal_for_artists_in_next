import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import { createServer } from 'utils/supabase/clientSSR';

import { Database } from 'types/database.types';
import { TableNameEnum } from 'types/global.types';

type UpdateCommentType = {
  tableName: TableNameEnum;
  nameId: 'commentId' | 'fileId' | 'fileCommentId' | 'subCommentId' | 'lastCommentId';
  id: string;
  content: string;
};

export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  const supabase = await createServer();

  try {
    const requestBody: UpdateCommentType = await new Promise((resolve, reject) => {
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

    const { tableName, nameId, id, content } = requestBody;

    const { error } = await supabase.from(tableName).insert([{ content }]).eq(nameId, id);

    return !error;
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Invalid request body' });
  }
}
