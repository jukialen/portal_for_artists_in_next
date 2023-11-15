import { useRouter } from 'next/router';
import { getAuthorisationURLWithQueryParamsAndSetState } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { Icon, useToast } from '@chakra-ui/react';

<<<<<<< Updated upstream:components/molecules/Providers/Providers.tsx
import { useHookSWR } from 'hooks/useHookSWR';
=======
import { useI18n } from "source/locales/client";
>>>>>>> Stashed changes:source/components/molecules/Providers/Providers.tsx

import styles from './Providers.module.scss';
import { FaDiscord, FaSpotify } from 'react-icons/fa';
import { RiGoogleFill, RiLineFill } from 'react-icons/ri';

export const Providers = () => {
  const { push } = useRouter();

  const toast = useToast();
  const data = useHookSWR();

  const signInWithProvider = async (provider: string) => {
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: provider,
        frontendRedirectURI: `${process.env.NEXT_PUBLIC_PAGE}/callback/${provider}`,
      });

      await push(authUrl);
    } catch (e: any) {
      console.error('e', e);
      toast({
        description: e.isSuperTokensGeneralError === true ? e.message : data?.unknownError,
        status: 'error',
        variant: 'subtle',
        duration: 9000,
      });
    }
  };

  return (
    <div className={styles.providers}>
      <button
        className={styles.button}
        type="submit"
        aria-label="google provider"
        onClick={() => signInWithProvider('google')}>
        <Icon as={RiGoogleFill} className={styles.svg} />
      </button>

      <button
        className={styles.button}
        type="submit"
        aria-label="spotify provider"
        onClick={() => signInWithProvider('spotify')}>
        <Icon as={FaSpotify} className={styles.svg} />
      </button>
      <button
        className={styles.button}
        type="submit"
        aria-label="discord provider"
        onClick={() => signInWithProvider('discord')}>
        <Icon as={FaDiscord} className={styles.svg} />
      </button>
      <button
        className={styles.button}
        type="submit"
        aria-label="line provider"
        onClick={() => signInWithProvider('line')}>
        <Icon as={RiLineFill} className={styles.svg} />
      </button>
    </div>
  );
};
