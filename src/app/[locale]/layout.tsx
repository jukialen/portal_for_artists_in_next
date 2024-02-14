import { ReactNode } from 'react';
import Script from 'next/script';

import { getStaticParams } from 'locales/server';
import { getSession } from "helpers/getSession";

import { LangType } from "types/global.types";
import { GTM_ID } from 'constants/links';

import { GlobalProvider } from 'providers/GlobalProvider';

import { UserHeader } from 'components/organisms/UserHeader/UserHeader';
import { Header } from 'components/organisms/Header/Header';
import { Aside } from 'components/organisms/Aside/Aside';
import { SkeletonRootLayout } from 'components/organisms/SkeletonRootLayout/SkeletonRootLayout';

import 'styles/reset.scss';
import 'styles/global.scss';
import 'styles/darkLightMode.scss';

type ChildrenType = {
  children: ReactNode;
  params: { locale: LangType };
};

export function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({ children, params }: ChildrenType) {
  const userMenuComponents = {
    userHeader: <UserHeader locale={params.locale} />,
    header: <Header locale={params.locale} />,
    aside: <Aside />,
  };

  const session = await getSession();
  
  return (
    <html lang={params.locale}>
      {process.env.NODE_ENV === 'production' && (
        <Script src={`https://cdn-cookieyes.com/client_data/${GTM_ID}/script.js`} strategy="beforeInteractive" />
      )}

      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src='https://cdn-cookieyes.com/client_data/${GTM_ID}/script.js' height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />

        <GlobalProvider locale={params.locale}>
          <SkeletonRootLayout session={session} userMenuComponents={userMenuComponents} locale={params.locale}>{children}</SkeletonRootLayout>
        </GlobalProvider>
      </body>
    </html>
  );
}
