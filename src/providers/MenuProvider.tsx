'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import { useUserData } from '../hooks/useUserData';

type childrenType = {
  children: ReactNode;
};

export const MenuContext = createContext({
  isMenu: '',
  changeMenu: (menu: string) => {},
});

export const MenuProvider = ({ children }: childrenType) => {
  const userData = useUserData();
  const [isMenu, setMenu] = useState(!!userData ? 'true' : 'false');

  useEffect(() => {
    !localStorage.getItem('login')!
      ? localStorage.setItem('login', !!userData ? 'true' : 'false')
      : localStorage.getItem('login');
    setMenu(localStorage.getItem('login')!);
  }, [userData]);

  const changeMenu = (menu: string) => {
    setMenu(menu);
    localStorage.setItem('login', menu);
  };

  return (
    <MenuContext.Provider
      value={{
        isMenu,
        changeMenu,
      }}>
      {children}
    </MenuContext.Provider>
  );
};
