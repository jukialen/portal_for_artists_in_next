import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from 'types/database.types';

const supabase = createServerComponentClient<Database>({ cookies });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupsPostsRoleId = searchParams.get('groupsPostsRoleId')!;
  const userId = searchParams.get('userId')!;

  try {
    const { data, error } = await supabase
      .from('Roles')
      .select('role')
      .eq('id', groupsPostsRoleId)
      .eq('userId', userId)
      .limit(1)
      .single();

    !!error && console.error(error);

    return data?.role;
  } catch (e) {
    console.error(e);
  }
}
