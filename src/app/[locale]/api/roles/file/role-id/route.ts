import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { Database } from 'types/database.types';

const supabase = createRouteHandlerClient<Database>({ cookies });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('fileId')!;
  const userId = searchParams.get('userId')!;

  try {
    const { data, error } = await supabase
      .from('Roles')
      .select('id')
      .eq('fileId', fileId)
      .eq('userId', userId)
      .limit(1)
      .single();

    if (!!error) {
      console.error(error);
      return;
    }

    return data.id;
  } catch (e) {
    console.error(e);
  }
}
