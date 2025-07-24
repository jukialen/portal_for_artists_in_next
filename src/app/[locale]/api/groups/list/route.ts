import { NextRequest } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

import { backUrl } from 'constants/links';
import { GroupListType } from 'types/global.types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const maxItems = searchParams.get('maxItems')!;
  const lastVisible = searchParams.get('lastVisible');

  const groupArray: GroupListType[] = [];

  try {
    const supabase = await createServer();

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
        fileUrl: !!g.logo ? g.logo : `${backUrl}/group.svg`,
      });
    }

    return groupArray;
  } catch (e) {
    console.error(e);
    return groupArray;
  }
}
