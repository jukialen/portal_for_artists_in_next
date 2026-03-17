import { createServer } from './supabase/clientSSR';

import { backUrl } from 'constants/links';
import { RoleType } from 'types/global.types';
import { NextResponse } from 'next/server';
import { string } from 'yup';

//SELECT
export const roles = async (roleId: string, userId: string) => {
  const params = { roleId, userId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const role: RoleType = await fetch(`${backUrl}/api/roles?${queryString}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return role;
  } catch (e) {
    console.error(e);
  }
};

export const getFileRoleId = async (fileId: string, userId: string) => {
  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Roles')
      .select('id')
      .eq('fileId', fileId)
      .eq('userId', userId)
      .limit(1)
      .maybeSingle();

    if (!!error || !data) {
      console.error(error);
      return { roleId: 'no id' };
    }

    return { roleId: data.id };
  } catch (e) {
    console.error(e);
    return { roleId: 'no id' };
  }
};

//POST
export const giveRole = async (roleId: string): Promise<{ role: RoleType | ''; message: string }> => {
  try {
    const supabase = await createServer();

    const { data, error } = await supabase.from('Roles').select('role').eq('id', roleId).limit(1).single();

    if (!!error) return { role: 'USER', message: error.message };

    return { role: data.role, message: '' };
  } catch (e: any) {
    console.error(e);
    return { role: '', message: e.message };
  }
};

export const groupRole = async (groupsPostsRoleId: string, userId: string) => {
  const params = { groupsPostsRoleId, userId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const role: RoleType = await fetch(`${backUrl}/api/roles/group?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return role;
  } catch (e) {
    console.error(e);
  }
};
