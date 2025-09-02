import { NextRequest, NextResponse } from 'next/server';
import { backUrl } from 'constants/links';
import { GroupUserType } from 'types/global.types';

import { createServer } from 'utils/supabase/clientSSR';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id')!;
  const maxItems = searchParams.get('maxItems')!;

  const adminArray: GroupUserType[] = [];

  const supabase = await createServer();

  try {
    const { data, error } = await supabase
      .from('Groups')
      .select('name, logo, groupId')
      .eq('adminId', id)
      .order('name', { ascending: true })
      .limit(parseInt(maxItems));

    if (data?.length === 0 || !!error) {
      console.error(error);
      return NextResponse.json(adminArray);
    }

    for (const _group of data!) {
      adminArray.push({
        name: _group.name,
        logo: !!_group.logo ? _group.logo : `${backUrl}/group.svg`,
        groupId: _group.groupId,
      });
    }

    return NextResponse.json(adminArray);
  } catch (e) {
    console.error(e);
    return NextResponse.json(adminArray);
  }
}
