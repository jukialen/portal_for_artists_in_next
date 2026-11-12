'use server';

import type { UserType } from 'types/global.types';

import { createServer } from 'utils/supabase/clientSSR';
import { sendLokiLog } from './Grafana/server/methods';
import { getTraceId } from './getHeaders';

export const getUserData = async (): Promise<UserType | null> => {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    await sendLokiLog('no user', await getTraceId(), 'error');
    return null;
  }

  let { id, email } = user;

  if (!id) {
    await sendLokiLog('no user id', await getTraceId(), 'error');
    return null;
  }

  const { data, error } = await supabase.from('Users').select('*').eq('id', id).limit(1).maybeSingle();

  if (!data || error) {
    await sendLokiLog('no user data', await getTraceId(), 'error');
    return null;
  }

  return {
    id,
    pseudonym: data?.pseudonym,
    description: data?.description,
    profilePhoto: data?.profilePhoto,
    email: email!,
    plan: data?.plan,
    provider: data?.provider,
    billingCycle: data?.billingCycle,
  };
};
