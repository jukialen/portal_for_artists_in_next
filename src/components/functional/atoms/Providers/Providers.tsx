'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';

import { createClient } from 'utils/supabase/clientCSR';

import { backUrl } from 'constants/links';

import { useI18n } from 'locales/client';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

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
          redirectTo: `${backUrl}/api/auth/callback`,
        },
      });

      if (!!error || !data) {
        setValuesFields(t('unknownError'));
      }
      console.log(valuesFields);
      if (data.url) {
        redirect(data.url);
      }
    } catch (e) {
      console.log(valuesFields);
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
        <RiGoogleFill className={styles.svg} />
      </button>

      <button
        className={styles.button}
        type="submit"
        aria-label="spotify provider"
        onClick={() => signInWithProvider('spotify')}>
        <FaSpotify className={styles.svg} />
      </button>
      <button
        className={styles.button}
        type="submit"
        aria-label="discord provider"
        onClick={() => signInWithProvider('discord')}>
        <FaDiscord className={styles.svg} />
      </button>

      <div className={styles.errorComp}>{!!valuesFields && <Alerts valueFields={valuesFields} />}</div>
    </div>
  );
};
