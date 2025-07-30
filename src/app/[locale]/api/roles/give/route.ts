import { NextApiRequest, NextApiResponse } from 'next';

import { createServer } from 'utils/supabase/clientSSR';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
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
    const supabase = await createServer();

    const { data, error } = await supabase.from('Roles').select('role').eq('id', requestBody.roleId).limit(1).single();

    if (!!error) res.status(400).json({ message: error.message });

    return res.status(201).json(data?.role!);
  } catch (e: any) {
    console.error(e);
    return res.status(400).json({ message: e.message });
  }
}
