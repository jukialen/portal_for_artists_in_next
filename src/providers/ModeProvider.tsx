'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

import { I18nProviderClient } from 'locales/client';

import { LangType } from 'types/global.types';

import { AffixButton } from 'components/atoms/AffixButton/AffixButton';
import Provider from 'components/ui/provider';

type childrenType = {
  children: ReactNode;
  locale: LangType;
};

type ModeType = 'light' | 'dark';

export const ModeContext = createContext({
  isMode: '',
  changeMode: (mode: ModeType) => {},
});

export const ModeProvider = ({ children, locale }: childrenType) => {
  const [isMode, setMode] = useState<ModeType>();

  const defaultTheme = (): ModeType | null => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('mode') as 'light' | 'dark' | null;

    const defaultMode = savedMode ?? (systemPrefersDark ? 'dark' : 'light');
    localStorage.setItem('chakra-ui-color-mode', defaultMode);
    return defaultMode;
  };

  useEffect(() => {
    const mode: ModeType | null = isMode ?? defaultTheme();
    setMode(mode!);
    localStorage.setItem('chakra-ui-color-mode', mode!);
    document.documentElement.setAttribute('data-theme', mode!);
    localStorage.setItem('mode', mode!);
  }, [isMode]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker zarejestrowany pomyślnie:', registration.scope);
          })
          .catch((error) => {
            console.error('Błąd rejestracji Service Workera:', error);
          });
      });
    }
  }, []);
  const changeMode = (mode: ModeType) => {
    setMode(mode);
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('mode', mode);
  };

  return (
    <Provider>
      <I18nProviderClient locale={locale}>
        <ModeContext.Provider
          value={{
            isMode: isMode!,
            changeMode,
          }}>
          {children}
          <AffixButton />
        </ModeContext.Provider>
      </I18nProviderClient>
    </Provider>
  );
};
