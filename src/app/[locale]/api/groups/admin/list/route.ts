import { NextRequest } from 'next/server';
import { createServer } from 'utils/supabase/clientSSR';

import { getUserData } from 'helpers/getUserData';
import { roles } from 'utils/roles';

import { backUrl } from 'constants/links';
import { GroupUserType } from 'types/global.types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const maxItems = searchParams.get('maxItems')!;

  const memberArray: GroupUserType[] = [];
  const moderatorArray: GroupUserType[] = [];

  const supabase = await createServer();
  const user = await getUserData();

  try {
    const { data, error } = await supabase
      .from('UsersGroups')
      .select('name, Groups!name (logo), groupId, roleId')
      .eq('userId', user?.id!)
      .order('name', { ascending: true })
      .limit(parseInt(maxItems));

    if (data?.length === 0 || !!error) {
      console.error(error);
      return { members: memberArray, moderators: moderatorArray };
    }

    for (const d of data) {
      const role = await roles(d.roleId, user?.id!);

      if (role == 'MODERATOR') {
        moderatorArray.push({
          name: d.name,
          logo: !!d.Groups?.logo ? d.Groups?.logo : `${backUrl}/group.svg`,
          groupId: d.groupId,
        });
      } else if (role == 'USER') {
        memberArray.push({
          name: d.name,
          logo: !!d.Groups?.logo ? d.Groups?.logo : `${backUrl}/group.svg`,
          groupId: d.groupId,
        });
      }
    }

    return { members: memberArray, moderators: moderatorArray };
  } catch (e) {
    console.error(e);
  }
}
