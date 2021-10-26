import { FC, useContext, useEffect } from 'react';

import { AffixButton } from 'components/molecules/AffixButton/AffixButton';
import { Footer } from 'components/organisms/Footer/Footer';
import { Header } from 'components/organisms/Header/Header';
import { Create } from 'components/organisms/NavForm/Create/Create';
import { Login } from 'components/organisms/NavForm/Login/Login';
import { Aside } from 'components/organisms/Aside/Aside';

import { ModeContext } from 'providers/ModeProvider';
import { ShowMenuProvider } from 'providers/ShowMenuProvider';
import { NavFormProvider } from 'providers/NavFormProvider';

export const Layout: FC = ({ children }) => {
  const { isMode } = useContext(ModeContext);

  let user;

  useEffect(() => {
    user = localStorage.getItem('user');
  }, [user]);

  return (
    <>
      <div className={`whole__page ${isMode ? 'dark' : ''}`}>
        <ShowMenuProvider>
          {!user ? (
            <NavFormProvider>
              <Header titleFirstNav='Zaloguj' titleSecondNav='Zarejestruj'logoLink='/' />
              <Create />
              <Login />
            </NavFormProvider>
          ) : <Header titleFirstNav='Wyloguj' titleSecondNav='Konto' logoLink='/application'/>
          }
        </ShowMenuProvider>
        <Aside />
        <main className="main__container">{children}</main>
      </div>
      <AffixButton />
      <Footer />
    </>
  );
};
