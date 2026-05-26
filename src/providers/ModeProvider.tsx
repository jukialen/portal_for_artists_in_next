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
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : 'light',
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const savedMode = localStorage.getItem('mode') as ModeType | null;
      const mode = savedMode ?? isMode;

      setMode(mode);
      document.documentElement.setAttribute('data-mode', mode);
      if (typeof localStorage !== 'undefined') localStorage.setItem('mode', mode);
    }
  }, []);

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
