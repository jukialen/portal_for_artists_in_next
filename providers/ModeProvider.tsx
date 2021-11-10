import { createContext, ReactNode } from 'react';

import { useLocalState } from 'hooks/useLocalState';

type childrenType = {
  children: ReactNode;
};

export const ModeContext = createContext({
  isMode: false,
  changeMode: () => {},
});

export const ModeProvider = ({ children }: childrenType) => {
  const [isMode, setMode] = useLocalState(false, 'mode');
  
  // @ts-ignore
  const changeMode = () => setMode(!isMode);
  
  return (
    <ModeContext.Provider
      value={{ // @ts-ignore
        isMode,
        changeMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
