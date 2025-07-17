'use client';

import {
  createContext,
  ReactNode,
  useEffect,
  useState
} from 'react';

type childrenType = {
  children: ReactNode;
};

type ModeType =  'light' | 'dark';

export const ModeContext = createContext({
  isMode: '',
  changeMode: (mode: ModeType) => {}
});

export const ModeProvider = ({ children }: childrenType) => {
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
  
  const changeMode = (mode: ModeType) => {
    setMode(mode);
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('mode', mode);
  };
  
  return (
    <ModeContext.Provider
      value={{
        isMode: isMode!,
        changeMode
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
