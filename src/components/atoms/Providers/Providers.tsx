'use client';

import { useState } from 'react';
import { permanentRedirect } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Icon } from '@chakra-ui/react';

import { LangType } from 'types/global.types';
import { Provider } from '@supabase/gotrue-js';

import { useI18n } from 'locales/client';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './Providers.module.scss';
import { FaDiscord, FaSpotify } from 'react-icons/fa';
import { RiGoogleFill } from 'react-icons/ri';

export const Providers = ({ locale }: { locale: LangType }) => {
  const [valuesFields, setValuesFields] = useState<string>('');

  const supabase = createClientComponentClient();

  const t = useI18n();

  const signInWithProvider = async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });

      (!!error || !data) && setValuesFields(t('unknownError'));
      permanentRedirect(`/${locale}/app`);
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

      {!!valuesFields && <Alerts valueFields={valuesFields} />}
    </div>
  );
};
