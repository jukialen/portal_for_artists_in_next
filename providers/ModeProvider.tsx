import { createContext, ReactNode } from 'react';

import { useLocalState } from 'hooks/useLocalState';
import { usePreferMode } from 'hooks/usePreferMode';

type childrenType = {
  children: ReactNode;
};

export const ModeContext = createContext({
  isMode: '',
  changeMode: () => {},
});

export const ModeProvider = ({ children }: childrenType) => {
  const [isMode, setMode] = useLocalState(usePreferMode(), 'mode');

  // @ts-ignore
  const changeMode = () => setMode(!isMode);

  return (
    <ModeContext.Provider
      value={{
        // @ts-ignore
        isMode,
        changeMode,
      }}>
      {children}
    </ModeContext.Provider>
  );
};
