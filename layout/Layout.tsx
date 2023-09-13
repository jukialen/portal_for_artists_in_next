import { ReactNode, useContext, useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { darkMode } from 'utilites/constants';

import { AffixButton } from 'components/molecules/AffixButton/AffixButton';
import { Header } from 'components/organisms/Header/Header';
import { Aside } from 'components/organisms/Aside/Aside';

import { ModeContext } from 'providers/ModeProvider';
import { MenuContext } from 'providers/MenuProvider';

import { UserHeader } from 'components/organisms/UserHeader/UserHeader';

import styles from './Layout.module.scss';

type ChildrenType = {
  children: ReactNode;
};

export const Layout = ({ children }: ChildrenType) => {
  const { isMode } = useContext(ModeContext);
  const { isMenu } = useContext(MenuContext);

  return (
    <ChakraProvider resetCSS={false}>
      <div className={`${styles.whole__page} ${isMode === darkMode ? 'dark' : ''}`}>
        {isMenu === 'true' ? <UserHeader /> : <Header />}
        <div className={styles.container}>
          {isMenu === 'true' && <Aside />}
          <main
            className={`${isMenu === 'true' ? styles.user__container : styles.main__container} ${
              isMode === darkMode ? 'main__container--dark' : ''
            }`}>
            <section className={styles.workspace}>{children}</section>
          </main>
        </div>
      </div>
      <AffixButton />
    </ChakraProvider>
  );
};
