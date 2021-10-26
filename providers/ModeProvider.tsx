import React, { ReactNode, useCallback } from 'react';

import { useLocalState } from 'hooks/useLocalState';

type childrenType = {
  children: ReactNode;
};

export const ModeContext = React.createContext({
  isMode: false,
  changeMode: () => {},
});

export const ModeProvider = ({ children }: childrenType) => {
  const [isMode, setMode] = useLocalState(false, 'mode');

  const changeMode = () => setMode(!isMode);

  return (
    <ModeContext.Provider
      value={{
        isMode,
        changeMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
