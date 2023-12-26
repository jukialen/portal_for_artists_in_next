'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { thirdPartySignInAndUp } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { useToast } from '@chakra-ui/react';

import { useI18n } from "locales/client";

export default function BackToApp() {
  const { push } = useRouter();

  const t = useI18n();

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
        
        !response.createdNewRecipeUser && push('/app');
      } else {
        toast({
          description: 'No email provided by social login. Please use another form of login',
          status: 'error',
          variant: 'subtle',
          duration: 9000,
        });
        return  push('/');
      }
    } catch (e: any) {
      toast({
        description: e.isSuperTokensGeneralError === true ? e.message : t('unknownError'),
        status: 'error',
        variant: 'subtle',
        duration: 9000,
      });
      return  push('/');
    }
  };

  useEffect(() => {
    handleProviderCallback();
  }, []);

  return null;
}
