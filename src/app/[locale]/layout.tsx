import { ReactNode } from 'react';
import Script from 'next/script';
import { Provider } from 'components/ui/provider';

import { getStaticParams } from 'locales/server';

import { GTM_ID } from 'constants/links';
import { LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';

import { GlobalProvider } from 'providers/GlobalProvider';

import { UserHeader } from 'components/organisms/UserHeader/UserHeader';
import { Header } from 'components/organisms/Header/Header';
import { Aside } from 'components/organisms/Aside/Aside';
import { SkeletonRootLayout } from 'components/organisms/SkeletonRootLayout/SkeletonRootLayout';

import 'styles/reset.scss';
import 'styles/global.scss';
import 'styles/darkLightMode.scss';
import { Viewport } from 'next';

type ChildrenType = {
  children: ReactNode;
  params: Promise<{ locale: LangType }>;
};

export const viewport: Viewport = {
  themeColor: '#FFD068',
};
export function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({ children, params }: ChildrenType) {
  const { locale } = await params;

  console.log('RootLayout locale:', locale);
  const userMenuComponents = {
    userHeader: <UserHeader />,
    header: <Header locale={locale} />,
    aside: <Aside />,
  };

  const user = await getUserData();

  const cookiesYesLink = `https://cdn-cookieyes.com/client_data/${GTM_ID}/script.js`;

  console.log('RootLayout user:', !!user);
  return (
    <html lang={locale} suppressHydrationWarning>
      {process.env.NODE_ENV === 'production' && <Script src={cookiesYesLink} strategy="beforeInteractive" />}

      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="${cookiesYesLink}" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />

        <Provider>
          <GlobalProvider locale={locale}>
            <SkeletonRootLayout isUser={!!user} userMenuComponents={userMenuComponents}>
              {children}
            </SkeletonRootLayout>
          </GlobalProvider>
        </Provider>
      </body>
    </html>
  );
}
