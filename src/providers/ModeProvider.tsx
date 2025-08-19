'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';

import { LangType, ModeType } from 'types/global.types';

import { AffixButton } from 'components/atoms/AffixButton/AffixButton';

type childrenType = {
  children: ReactNode;
  locale: LangType;
};

export const ModeContext = createContext({
  isMode: '',
  changeMode: (mode: ModeType) => {},
});

export const ModeProvider = ({ children, locale }: childrenType) => {
  const [isMode, setMode] = useState<ModeType>();

  const defaultTheme = (): ModeType | null => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('mode') as ModeType | null;

    const defaultMode = savedMode ?? (systemPrefersDark ? 'dark' : 'light');
    localStorage.setItem('chakra-ui-color-mode', defaultMode);
    return defaultMode;
  };

  useEffect(() => {
    const mode: ModeType | null = isMode ?? defaultTheme();
    setMode(mode!);
    localStorage.setItem('chakra-ui-color-mode', mode!);
    document.documentElement.setAttribute('data-mode', mode!);
    document.documentElement.setAttribute('data-theme', mode!);
    localStorage.setItem('mode', mode!);
  }, [isMode]);

  const changeMode = (mode: ModeType) => {
    setMode(mode);
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('mode', mode);
  };

  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="data-mode" disableTransitionOnChange enableSystem={false} enableColorScheme={false}>
        <ModeContext.Provider
          value={{
            isMode: isMode!,
            changeMode,
          }}>
          {children}
          <AffixButton />
        </ModeContext.Provider>
      </ThemeProvider>
    </ChakraProvider>
  );
};
