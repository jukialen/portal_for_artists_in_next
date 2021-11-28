import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import useSWR from "swr";

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
  
  const { locale } = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data } = useSWR(`/languages/${locale}.json`, fetcher);
  
  return (
    <>
      <div className={`whole__page ${isMode ? 'dark' : ''}`}>
        <ShowMenuProvider>
          {isUser ?
            <Header titleFirstNav={data?.Nav?.signOut} titleSecondNav={data?.Nav?.account} logoLink='/app' />
            : (
              <NavFormProvider>
                <Header titleFirstNav={data?.Nav?.signIn} titleSecondNav={data?.Nav?.signUp} logoLink='/' />
                <Create />
                <Login />
              </NavFormProvider>
            )
          }
        </ShowMenuProvider>
        <Aside />
        <main className='main__container'>{children}</main>
      </div>
      <AffixButton />
      <Footer />
    </>
  );
};
