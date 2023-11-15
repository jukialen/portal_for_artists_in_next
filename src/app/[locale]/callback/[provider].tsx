import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { thirdPartySignInAndUp } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { useToast } from '@chakra-ui/react';

<<<<<<<< Updated upstream:pages/callback/[provider].tsx
import { useHookSWR } from 'hooks/useHookSWR';
========
import { useI18n } from "src/locales/client";
>>>>>>>> Stashed changes:source/app/[locale]/callback/[provider].tsx

export default function BackToApp() {
  const { push } = useRouter();

  const data = useHookSWR();
  const toast = useToast();

  const handleProviderCallback = async () => {
    try {
      const response = await thirdPartySignInAndUp();

      if (response.status === 'OK') {
        toast({
          description: 'Success!',
          status: 'success',
          variant: 'subtle',
          duration: 9000,
        });
        !response.createdNewUser && (await push('/app'));
      } else {
        toast({
          description: 'No email provided by social login. Please use another form of login',
          status: 'error',
          variant: 'subtle',
          duration: 9000,
        });
        await push('/');
      }
    } catch (e: any) {
      toast({
        description: e.isSuperTokensGeneralError === true ? e.message : data?.unknownError,
        status: 'error',
        variant: 'subtle',
        duration: 9000,
      });
      await push('/');
    }
  };

  useEffect(() => {
    handleProviderCallback();
  }, []);

  return null;
}
