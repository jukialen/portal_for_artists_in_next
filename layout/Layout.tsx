import { FC, useContext } from 'react';
import { ChakraProvider } from '@chakra-ui/react'

import { useHookSWR } from 'hooks/useHookSWR';

import { AffixButton } from 'components/molecules/AffixButton/AffixButton';
import { Footer } from 'components/molecules/Footer/Footer';
import { Header } from 'components/organisms/Header/Header';
import { Create } from 'components/organisms/NavForm/Create/Create';
import { Login } from 'components/organisms/NavForm/Login/Login';
import { Aside } from 'components/organisms/Aside/Aside';

import { ModeContext } from 'providers/ModeProvider';
import { ShowMenuProvider } from 'providers/ShowMenuProvider';
import { NavFormProvider } from 'providers/NavFormProvider';
import { StatusLoginContext } from "providers/StatusLogin";

export const Layout: FC = ({ children }) => {
  const { isMode } = useContext(ModeContext);
  const { isUser } = useContext(StatusLoginContext);
  
  const data = useHookSWR();
  
  return (
    <ChakraProvider resetCSS={false}>
      <div className={`whole__page ${isMode ? 'dark' : ''}`}>
        <ShowMenuProvider>
          {isUser ?
            <Header titleFirstNav={data?.Nav?.signOut} titleSecondNav={data?.Nav?.account} logoLink='/app' />
            : (
              <NavFormProvider>
                <Header titleFirstNav={data?.Nav?.signIn} titleSecondNav={data?.Nav?.signUp} logoLink='/' />
                <Create data={data} />
                <Login data={data} />
              </NavFormProvider>
            )
          }
        </ShowMenuProvider>
        <Aside />
        <main className={`main__container ${isMode ? 'main__container--dark' : ''}`}>
          <section className='workspace'>
            { children }
          </section>
        </main>
      </div>
      <Footer />
      <AffixButton />
    </ChakraProvider>
  );
};
