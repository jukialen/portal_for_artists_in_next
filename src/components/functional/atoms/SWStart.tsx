'use client';

import { ReactNode, useEffect } from 'react';

import { I18nProviderClient } from 'locales/client';

import { LangType } from 'types/global.types';

import LoadingPage from 'components/ui/atoms/LoadingPage/LoadingPage';

type childrenType = {
  children: ReactNode;
  locale: LangType;
};

export const SWStart = ({ children, locale }: childrenType) => {
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

  return (
    <I18nProviderClient locale={locale} fallback={<LoadingPage />}>
      {children}
    </I18nProviderClient>
  );
};
