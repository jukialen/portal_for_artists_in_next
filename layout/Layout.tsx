import { ReactNode, useContext } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

import { AffixButton } from 'components/molecules/AffixButton/AffixButton';
import { Header } from 'components/organisms/Header/Header';
import { Create } from 'components/organisms/NavForm/Create/Create';
import { Login } from 'components/organisms/NavForm/Login/Login';
import { Aside } from 'components/organisms/Aside/Aside';

import { ModeContext } from 'providers/ModeProvider';
import { ShowMenuProvider } from 'providers/ShowMenuProvider';
import { NavFormProvider } from 'providers/NavFormProvider';
import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './Layout.module.scss';

type ChildrenType = {
  children: ReactNode;
};

export const Layout = ({ children }: ChildrenType) => {
  const { isMode } = useContext(ModeContext);
  const { isUser } = useContext(StatusLoginContext);

  const data = useHookSWR();

  return (
    <ChakraProvider resetCSS={false}>
      <div className={`${styles.whole__page} ${isMode ? 'dark' : ''}`}>
        <NavFormProvider>
          <ShowMenuProvider>
            {isUser ? (
              <Header titleFirstNav={data?.Nav?.signOut} titleSecondNav={data?.Nav?.account} logoLink="/app" />
            ) : (
              <>
                <Header titleFirstNav={data?.Nav?.signIn} titleSecondNav={data?.Nav?.signUp} logoLink="/" />
                <Create data={data} />
                <Login data={data} />
              </>
            )}
          </ShowMenuProvider>
          <div className={styles.container}>
            {isUser && <Aside />}
            <main
              className={`${isUser ? styles.main__container : styles.home__container} ${
                isMode ? 'main__container--dark' : ''
              }`}>
              <section className={styles.workspace}>{children}</section>
            </main>
          </div>
        </NavFormProvider>
      </div>
      <AffixButton />
    </ChakraProvider>
  );
};
