'use server';

import { createServer } from 'utils/supabase/clientSSR';
import { sendLokiLog } from 'helpers/Grafana/server/methods';
import { getTraceId } from 'helpers/getHeaders';

import { RoleType } from 'types/global.types';

//SELECT
export const getFileRoleId = async (fileId: string, userId: string): Promise<{ roleId: string }> => {
  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Roles')
      .select('id, role')
      .eq('fileId', fileId)
      .eq('userId', userId)
      .limit(1)
      .maybeSingle();

    if (!!error || !data) {
      const { data: newRoleId, error } = await supabase
        .from('Roles')
        .insert([{ fileId, userId, role: 'USER' }])
        .select('id')
        .limit(1)
        .maybeSingle();

      if (!!error) {
        await sendLokiLog(error?.message!, await getTraceId(), 'error');
        return { roleId: 'no role id' };
      }

      return { roleId: newRoleId?.id! };
    }

    return { roleId: !!error || !data ? 'no id' : data?.id! };
  } catch (e) {
    console.error(e);
    return { roleId: 'no id' };
  }
};

export const roles = async (roleId: string, userId: string): Promise<RoleType> => {
  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Roles')
      .select('role')
      .eq('id', roleId)
      .eq('userId', userId)
      .limit(1)
      .maybeSingle();

    return !error ? data?.role! : 'USER';
  } catch (e) {
    console.error(e);
    return 'USER';
  }
};

export const groupRole = async (groupsPostsRoleId: string, userId: string): Promise<RoleType> => {
  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Roles')
      .select('role')
      .eq('id', groupsPostsRoleId)
      .eq('userId', userId)
      .limit(1)
      .single();

    return !error ? data?.role : 'USER';
  } catch (e) {
    console.error(e);
    return 'USER';
  }
};

//POST
export const giveRole = async (roleId: string): Promise<{ role: RoleType; message: string }> => {
  try {
    const supabase = await createServer();

    const { data, error } = await supabase.from('Roles').select('role').eq('id', roleId).limit(1).maybeSingle();

    if (!!error) return { role: 'USER', message: error.message };

    return { role: data?.role || 'USER', message: '' };
  } catch (e: any) {
    console.error(e);
    return { role: 'USER', message: e.message };
  }
};
