'use client';

import { createContext, ReactNode, useState } from 'react';

type childrenType = {
  children: ReactNode;
};

export const MenuContext = createContext({
  isMenu: '',
  changeMenu: (menu: string) => {},
});

export const MenuProvider = ({ children }: childrenType) => {
  const [isMenu, setMenu] = useState((typeof window !== 'undefined' && localStorage.getItem('login')) || 'false');

  console.log('isMenu', isMenu);

  const changeMenu = (menu: string) => {
    setMenu(menu);
    localStorage.setItem('login', `${menu}`);
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
