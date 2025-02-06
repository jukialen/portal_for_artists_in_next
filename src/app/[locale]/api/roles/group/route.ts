import { NextRequest } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupsPostsRoleId = searchParams.get('groupsPostsRoleId')!;
  const userId = searchParams.get('userId')!;

  try {
    const supabase = await createServer();

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
