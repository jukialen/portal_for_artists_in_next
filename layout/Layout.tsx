import { FC, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { AffixButton } from 'components/molecules/AffixButton/AffixButton';
import { Footer } from 'components/organisms/Footer/Footer';
import { Header } from 'components/organisms/Header/Header';
import { Create } from 'components/organisms/NavForm/Create/Create';
import { Login } from 'components/organisms/NavForm/Login/Login';
import { Aside } from 'components/organisms/Aside/Aside';

import { ModeContext } from 'providers/ModeProvider';
import { ShowMenuProvider } from 'providers/ShowMenuProvider';

export const Layout: FC = ({ children }) => {
  const { isMode } = useContext(ModeContext);

  const router = useRouter();

  let user;

  useEffect(() => {
    user = localStorage.getItem('user');
    !!user ? router.push('/app') : router.push('/');
  }, [router, user]);

  return (
    <>
      <div className={`whole__page ${isMode ? 'dark' : ''}`}>
        <ShowMenuProvider>
          <Header />
          {!user ? (
            <>
              <Create />
              <Login />
            </>
          ) : null}
        </ShowMenuProvider>
        <Aside />
        <main>{children}</main>
        <AffixButton />
      </div>
      <Footer />
    </>
  );
};
