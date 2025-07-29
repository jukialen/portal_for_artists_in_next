'use client';

import { useState } from 'react';
import { permanentRedirect } from 'next/navigation';
import { Icon } from '@chakra-ui/react';

import { createClient } from 'utils/supabase/clientCSR';

import { backUrl, newUserRed } from 'constants/links';

import { useI18n } from 'locales/client';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './Providers.module.scss';
import { FaDiscord, FaSpotify } from 'react-icons/fa';
import { RiGoogleFill } from 'react-icons/ri';

export const Providers = () => {
  const [valuesFields, setValuesFields] = useState<string>('');

  const supabase = createClient();

  const t = useI18n();

  type ProviderType = 'google' | 'spotify' | 'discord';

  const signInWithProvider = async (provider: ProviderType) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${backUrl}/auth/callback?next=${newUserRed}`,
        },
      });

      (!!error || !data) && setValuesFields(t('unknownError'));
      permanentRedirect('/app');
    } catch (e) {
      setValuesFields(t('unknownError'));
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

      <div className={styles.errorComp}>{!!valuesFields && <Alerts valueFields={valuesFields} />}</div>
    </div>
  );
};
