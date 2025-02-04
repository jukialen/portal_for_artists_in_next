import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from 'types/database.types';
import { RoleType } from "../types/global.types";

const supabase = createServerComponentClient<Database>({ cookies });

//SELECT
export const roles = async (roleId: string, userId: string) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data, error } = await supabase.from('Roles').select('role').eq('roleId', roleId).eq('userId', userId).limit(1).maybeSingle();
  
  !!error && console.error(error);
  
  return data?.role!;
}

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

//POST
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

export const groupRole = async (groupsPostsRoleId: string, userId: string): Promise<RoleType | undefined> => {
  try {
    const { data, error } = await supabase
    .from('Roles')
    .select('role')
    .eq('id', groupsPostsRoleId)
    .eq('userId', userId)
    .limit(1)
    .single();
    
    !!error && console.error(error);
    
    return data?.role;
  } catch (e) {
    console.error(e);
  }
};
