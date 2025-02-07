'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

type childrenType = {
  children: ReactNode;
};

export const ModeContext = createContext({
  isMode: '',
  changeMode: (mode: 'dark' | 'light') => {},
});

export const ModeProvider = ({ children }: childrenType) => {
  const [isMode, setMode] = useState<string>();

  const defaultTheme = () => {
    const watchSysTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const themeLocalStorage = localStorage.getItem('mode');
    const themeSystem = watchSysTheme.matches ? 'dark' : 'light';
  
    if (themeLocalStorage !== undefined || null) {
      return themeLocalStorage ?? themeSystem;
    }
  };

  useEffect(() => {
    if (!isMode) return setMode(defaultTheme());
    localStorage.setItem('mode', isMode ?? defaultTheme());
    localStorage.setItem('chakra-ui-color-mode',isMode ?? defaultTheme());
    
    setMode(isMode ?? defaultTheme());
  }, [isMode]);

  const changeMode = (mode: string) => {
    if (mode === 'dark') {
      setMode('dark');
      localStorage.setItem('mode', 'dark');
      localStorage.setItem('chakra-ui-color-mode', 'dark');
    } else {
      localStorage.setItem('mode', 'light');
      localStorage.setItem('chakra-ui-color-mode', 'light');
      setMode('light');
    }
  };

  return (
    <ModeContext.Provider
      value={{
        isMode: isMode!,
        changeMode,
      }}>
      {children}
    </ModeContext.Provider>
  );
};
