import { createContext, ReactNode, useCallback, useState } from 'react';

export const ShowMenuContext = createContext({
  isMenu: false,
  showMenu: () => {},
});

type childrenType = {
  children: ReactNode;
};

export const ShowMenuProvider = ({ children }: childrenType) => {
  const [isMenu, setMenu] = useState<boolean>(false);

  const showMenu = useCallback(() => setMenu(!isMenu), [isMenu]);

  return (
    <ShowMenuContext.Provider
      value={{
        isMenu,
        showMenu,
      }}>
      {children}
    </ShowMenuContext.Provider>
  );
};
