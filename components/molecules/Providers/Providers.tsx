import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthorisationURLWithQueryParamsAndSetState } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { Icon } from '@chakra-ui/react'

import { useHookSWR } from 'hooks/useHookSWR';

import { NavFormContext } from 'providers/NavFormProvider';
import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './Providers.module.scss';
import { FaDiscord, FaSpotify } from "react-icons/fa";
import { RiGoogleFill, RiLineFill } from "react-icons/ri";

export const Providers = () => {
  const { push } = useRouter();
  const { showUser } = useContext(StatusLoginContext);
  const { isLogin, isCreate, showLoginForm, showCreateForm } = useContext(NavFormContext);
  const [valuesFields, setValuesFields] = useState<string>('');

  const data = useHookSWR();

  const signInWithProvider = async (provider: string) => {
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        providerId: provider,
        authorisationURL: `${process.env.NEXT_PUBLIC_PAGE}/callback/${provider}`,
      });
      push(authUrl);
    } catch (e: any) {
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : data?.unknownError);
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
