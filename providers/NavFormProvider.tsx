import React, { ReactNode, useState, createContext, useCallback } from 'react';

export const NavFormContext = createContext({
  isLogin: false,
  isCreate: false,
  showLoginForm: () => {},
  showCreateForm: () => {},
});

type childrenType = {
  children: ReactNode;
};

export const NavFormProvider = ({ children }: childrenType) => {
  const [isLogin, setLogin] = useState<boolean>(false);
  const [isCreate, setCreate] = useState<boolean>(false);

  const showLoginForm = useCallback(() => setLogin(!isLogin), [isLogin]);

  const showCreateForm = useCallback(() => setCreate(!isCreate), [isCreate]);

  return (
    <NavFormContext.Provider
      value={{
        isLogin,
        showLoginForm,
        isCreate,
        showCreateForm,
      }}
    >
      {children}
    </NavFormContext.Provider>
  );
};
