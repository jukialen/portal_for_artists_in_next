import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createServer } from 'utils/supabase/clientSSR';

import { Database } from 'types/database.types';
import { GroupUserType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const maxItems = searchParams.get('maxItems')!;

  const adminArray: GroupUserType[] = [];

  const supabase = await createServer();
  const user = await getUserData();

  try {
    const { data, error } = await supabase
      .from('Groups')
      .select('name, logo, groupId')
      .eq('adminId', user?.id!)
      .order('name', { ascending: true })
      .limit(parseInt(maxItems));

    if (data?.length === 0 || !!error) {
      console.error(error);
      return adminArray;
    }

    for (const _group of data!) {
      adminArray.push({
        name: _group.name,
        logo: !!_group.logo ? _group.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        groupId: _group.groupId,
      });
    }

    return adminArray;
  } catch (e) {
    console.error(e);
  }
}
