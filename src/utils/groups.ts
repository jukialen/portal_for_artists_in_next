'use server';

import { backUrl } from 'constants/links';
import { GroupListType, GroupUserType } from 'types/global.types';
import { createServer } from './supabase/clientSSR';
import { getLinkUrl } from 'helpers/getLinkUrl';
import { getUserData } from '../helpers/getUserData';
import { roles } from './server/roles';

export const nextGroupList = async (maxItems: number, lastVisible: string): Promise<GroupListType[]> => {
  const groupArray: GroupListType[] = [];

  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Groups')
      .select('name, logo')
      .gt('name', lastVisible)
      .order('name', { ascending: false })
      .limit(maxItems);

    if (!!error) {
      console.error(error);
      return groupArray;
    }

    for (const g of data) {
      const groupLogo = await getLinkUrl('logos', `${backUrl}/group.svg`, g.logo);

      groupArray.push({
        name: g.name!,
        fileUrl: groupLogo,
      });
    }

    return groupArray;
  } catch (e) {
    console.error(e);
    return groupArray;
  }
};

export const adminList = async (id: string, maxItems: number): Promise<GroupUserType[]> => {
  const adminArray: GroupUserType[] = [];

  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Groups')
      .select('name, logo, groupId')
      .eq('adminId', id)
      .order('name', { ascending: true })
      .limit(maxItems);

    if (data?.length === 0 || !!error) {
      console.error(error);
      return adminArray;
    }

    for (const _group of data!) {
      const groupLogo = await getLinkUrl('logos', `${backUrl}/group.svg`, _group.logo);

      adminArray.push({
        name: _group.name,
        logo: groupLogo,
        groupId: _group.groupId,
      });
    }

    return adminArray;
  } catch (e) {
    console.error(e);
    return adminArray;
  }
};

export const modsUsersList = async (
  maxItems: number,
): Promise<{ members: GroupUserType[]; moderators: GroupUserType[] }> => {
  const memberArray: GroupUserType[] = [];
  const moderatorArray: GroupUserType[] = [];

  try {
    const supabase = await createServer();
    const user = await getUserData();

    const { data, error } = await supabase
      .from('UsersGroups')
      .select('name, Groups!name (logo), groupId, roleId')
      .eq('userId', user?.id!)
      .order('name', { ascending: true })
      .limit(maxItems);

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
    return { members: memberArray, moderators: moderatorArray };
  }
};
