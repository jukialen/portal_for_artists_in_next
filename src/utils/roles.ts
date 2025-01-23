import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from 'types/database.types';

const supabase = createServerComponentClient<Database>({ cookies });

export const giveRole = async (roleId: string) => {
  try {
    const { data, error } = await supabase.from('Roles').select('role').eq('id', roleId).limit(1).single();

    if (!!error) {
      console.error(error);
      return;
    }

    return data.role;
  } catch (e) {
    console.error(e);
  }
};

export const getFileRoleId = async (fileId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('Roles')
      .select('id')
      .eq('fileId', fileId)
      .eq('userId', userId)
      .limit(1)
      .single();

    if (!!error) {
      console.error(error);
      return;
    }

    return data.id;
  } catch (e) {
    console.error(e);
  }
};
