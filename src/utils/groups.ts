import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getUserData } from 'helpers/getUserData';

import { Database } from 'types/database.types';
import { GroupUserType } from "types/global.types";


export  const roles = async (roleId: string, userId: string) => {
  'use server';
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data, error } = await supabase.from('Roles').select('role').eq('roleId', roleId).eq('userId', userId).limit(1).maybeSingle();
  
  return data?.role!;
}

export const adminList = async (maxItems: number) => {
  'use server';
  const supabase = createServerComponentClient<Database>({ cookies });
  const user = await getUserData();

  const adminArray: GroupUserType[] = [];

  try {
    const { data, error } = await supabase
      .from('Groups')
      .select('name, logo, groupId')
      .eq('adminId', user?.id!)
      .order('name', { ascending: true })
      .limit(maxItems);
    
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
};

export const modsUsersList = async (maxItems: number) => {
  'use server';
  const supabase = createServerComponentClient<Database>({ cookies });
  const user = await getUserData();
  
  const memberArray: GroupUserType[] = [];
  const moderatorArray: GroupUserType[] = [];

  try {
    const { data, error } = await supabase
      .from('UsersGroups')
      .select('name, Groups (logo), groupId, roleId')
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
          logo: !!d.Groups?.logo ? d.Groups?.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          groupId: d.groupId,
        });
      } else if (role == 'USER') {
        memberArray.push({
          name: d.name,
          logo: !!d.Groups?.logo ? d.Groups?.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          groupId: d.groupId,
        });
      }
    }
    
    return { members: memberArray, moderators: moderatorArray };
  } catch (e) {
    console.error(e);
  }
};