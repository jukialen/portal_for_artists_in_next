'use client';

import { permanentRedirect } from 'next/navigation';
import { Icon, useToast } from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { LangType } from 'types/global.types';
import { Provider } from '@supabase/gotrue-js';

import { useI18n } from 'locales/client';

import styles from './Providers.module.scss';
import { FaDiscord, FaSpotify } from 'react-icons/fa';
import { RiGoogleFill } from 'react-icons/ri';

export const Providers = ({ locale }: { locale: LangType }) => {
  const supabase = createClientComponentClient();

  const t = useI18n();

  const toast = useToast();

  const signInWithProvider = async (provider: Provider) => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: provider,
      });
      
      permanentRedirect(`/${locale}/app`);
    } catch (e: any) {
      toast({
        description: t('unknownError'),
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
    </div>
  );
};
