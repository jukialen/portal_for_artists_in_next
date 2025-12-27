'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

import { ModeType } from 'types/global.types';

import { AffixButton } from 'components/ui/atoms/AffixButton/AffixButton';

export const ModeContext = createContext({
  isMode: '',
  changeMode: (mode: ModeType) => {},
});

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [isMode, setMode] = useState<ModeType>(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );

  useEffect(() => {
    const defaultTheme = (): ModeType | null => {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedMode = localStorage.getItem('mode') as ModeType | null;

      const defaultMode = savedMode ?? (systemPrefersDark ? 'dark' : 'light');
      return defaultMode;
    };

    const mode: ModeType | null = isMode ?? defaultTheme();
    setMode(mode!);
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
    <ModeContext.Provider
      value={{
        isMode,
        changeMode,
      }}>
      {children}
      <AffixButton />
    </ModeContext.Provider>
  );
};
