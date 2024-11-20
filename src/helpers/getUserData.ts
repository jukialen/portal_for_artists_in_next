'use server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { Database } from 'types/database.types';
import { UserType } from "../types/global.types";

export const getUserData = async (): Promise<UserType | undefined> => {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: dataSession } = await supabase.auth.getUser();

  const id = dataSession.user?.id;

  if (id) {
    const { data, error } = await supabase.from('Users').select('*').eq('id', id);

    if (data) {
      return {
        id,
        pseudonym: data[0].pseudonym!,
        description: data[0].description!,
        profilePhoto: data[0].profilePhoto!,
        email: dataSession.user?.email!,
        plan: data[0].plan!,
        provider: data[0].provider!,
      };
    }
  } else {
    console.error('not user');
  }
};
