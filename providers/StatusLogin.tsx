import { createContext, ReactNode } from 'react';
import { useLocalState } from 'hooks/useLocalState';

type childrenType = {
  children: ReactNode;
};

export const StatusLoginContext = createContext({
  isUser: false,
  showUser: () => {},
});

export const StatusLoginProvider = ({ children }: childrenType) => {
  const [isUser, setUser] = useLocalState(false, 'SL');
  // @ts-ignore
  const showUser = () => setUser(!isUser);
  
  return (
    <StatusLoginContext.Provider
      value={{ // @ts-ignore
        isUser,
        showUser
      }}
    >
      {children}
    </StatusLoginContext.Provider>
  );
};
