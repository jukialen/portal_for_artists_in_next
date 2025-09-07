import { createServer } from 'utils/supabase/clientSSR';

import { UserType } from 'types/global.types';

export const getUserData = async (): Promise<UserType | undefined> => {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const id = user?.id;

  if (id) {
    const { data, error } = await supabase.from('Users').select('*').eq('id', id).limit(1).maybeSingle();

    let { data: fileData } = await supabase.from('Files').select('fileUrl').eq('authorId', id);

    console.log('data', data);
    console.log('fileData', fileData);

    if (data) {
      return {
        id,
        pseudonym: data?.pseudonym!,
        description: data?.description!,
        profilePhoto: `${!fileData ? fileData![0].fileUrl! : data?.profilePhoto!}`,
        email: user?.email!,
        plan: data?.plan!,
        provider: data?.provider!,
      };
    } else {
      console.log(`Error for getting user data: ${error?.message}, with ${error?.code}`);
    }
  } else {
    console.log('not user');
  }
};
