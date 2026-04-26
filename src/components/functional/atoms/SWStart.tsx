'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { I18nProviderClient } from 'locales/client';

import { LangType } from 'types/global.types';

import LoadingPage from 'components/ui/atoms/LoadingPage/LoadingPage';
import { faroConfig } from '../../../helpers/Grafana/client/config';
import { actionFaroLog } from '../../../helpers/Grafana/client/methods';

type childrenType = {
  children: ReactNode;
  locale: LangType;
};

export const SWStart = ({ children, locale }: childrenType) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker successfully registered:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration error:', error);
          });
      });
    }
  }, []);

  useEffect(() => {
    faroConfig(); // initialises in the browser
  }, []);

  useEffect(() => {
    const start = Date.now();

    return () => {
      const timeSpent = Date.now() - start;
      actionFaroLog('page_exit', pathname, timeSpent);
    };
  }, [pathname]);

  return (
    <I18nProviderClient locale={locale} fallback={<LoadingPage />}>
      {children}
    </I18nProviderClient>
  );
};
