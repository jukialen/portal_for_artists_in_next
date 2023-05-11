import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { thirdPartySignInAndUp } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { useToast } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

export default function BackToApp() {
  const { push } = useRouter();

  const data = useHookSWR();
  const toast = useToast();

  const handleProviderCallback = async () => {
    try {
      const response = await thirdPartySignInAndUp();

      console.log(response);

      if (response.status === 'OK') {
        console.log(response.user);
        toast({
          description: 'Success!',
          status: 'success',
          variant: 'subtle',
          duration: 9000,
        });
        response.createdNewUser && push('/app');
      } else {
        toast({
          description: 'No email provided by social login. Please use another form of login',
          status: 'error',
          variant: 'subtle',
          duration: 9000,
        });
        push('/');
      }
    } catch (e: any) {
      toast({
        description: e.isSuperTokensGeneralError === true ? e.message : data?.unknownError,
        status: 'error',
        variant: 'subtle',
        duration: 9000,
      });
    }
  };

  useEffect(() => {
    handleProviderCallback();
  }, []);

  return null;
}
