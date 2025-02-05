import { NextApiRequest } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from 'types/database.types';

const supabase = createServerComponentClient<Database>({ cookies });

export async function POST(req: NextApiRequest) {
  const requestBody: { roleId: string } = await new Promise((resolve, reject) => {
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

  try {
    const { data, error } = await supabase.from('Roles').select('role').eq('id', requestBody.roleId).limit(1).single();

    if (!!error) console.error(error);

    return data?.role!;
  } catch (e) {
    console.error(e);
  }
}
