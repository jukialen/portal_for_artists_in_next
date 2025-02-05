import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { Database } from 'types/database.types';
import { GroupListType } from 'types/global.types';

const supabase = createRouteHandlerClient<Database>({ cookies });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const maxItems = searchParams.get('maxItems')!;
  const lastVisible = searchParams.get('lastVisible');

  const groupArray: GroupListType[] = [];

  const { data, error } = await supabase
    .from('Groups')
    .select('name, logo')
    .gt('name', lastVisible)
    .order('name', { ascending: false })
    .limit(parseInt(maxItems));

  if (!!error) {
    console.error(error);
    return groupArray;
  }

  for (const g of data) {
    groupArray.push({
      name: g.name!,
      fileUrl: !!g.logo ? g.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
    });
  }

  return groupArray;
}
