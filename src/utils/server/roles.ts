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
      .select('id')
      .eq('fileId', fileId)
      .eq('userId', userId)
      .limit(1)
      .maybeSingle();

    console.log('data role', data, fileId, userId);

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

//POST
export const giveRole = async (roleId: string): Promise<{ role: RoleType | ''; message: string }> => {
  try {
    const supabase = await createServer();

    const { data, error } = await supabase.from('Roles').select('role').eq('id', roleId).limit(1).maybeSingle();

    console.log('data giveRole', data);
    console.log('error giveRole', error);

    if (!!error) return { role: 'USER', message: error.message };

    return { role: data?.role || 'USER', message: '' };
  } catch (e: any) {
    console.error(e);
    return { role: '', message: e.message };
  }
};
