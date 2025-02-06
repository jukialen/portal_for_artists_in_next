import { createServer } from 'utils/supabase/clientSSR';

import { UserType } from 'types/global.types';

export const getUserData = async (): Promise<UserType | undefined> => {
  const supabase = await createServer();

  const { data: dataSession } = await supabase.auth.getUser();

  const id = dataSession.user?.id;

  if (id) {
    const { data, error } = await supabase.from('Users').select('*').eq('id', id).limit(1).maybeSingle();

    if (data) {
      return {
        id,
        pseudonym: data?.pseudonym!,
        description: data?.description!,
        profilePhoto: data?.profilePhoto!,
        email: dataSession.user?.email!,
        plan: data?.plan!,
        provider: data?.provider!,
      };
    } else {
      console.error(`Error for getting user data: ${error?.message}, wit ${error?.code}`);
    }
  } else {
    console.error('not user');
  }
};
