import { ReactNode } from 'react';
import Script from 'next/script';
import SuperTokens from 'supertokens-web-js';
import ThirdPartyEmailPasswordWebJs from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import EmailVerification from 'supertokens-web-js/recipe/emailverification';
import Session from 'supertokens-web-js/recipe/session';

import { getStaticParams } from 'locales/server';

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
  params: { locale: string };
};

export function generateStaticParams() {
  return getStaticParams();
}

const GTM_ID = process.env.NEXT_PUBLIC_G_TAG;

export default async function RootLayout({ children, params }: ChildrenType) {
  const userMenuComponents = {
    userHeader: <UserHeader locale={params.locale} />,
    header: <Header locale={params.locale} />,
    aside: <Aside />,
  };

  if (typeof window !== 'undefined') {
    SuperTokens.init({
      appInfo: {
        appName: process.env.NEXT_PUBLIC_APP_NAME!,
        apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN!,
        apiBasePath: '/auth',
      },
      recipeList: [ThirdPartyEmailPasswordWebJs.init(), EmailVerification.init(), Session.init()],
    });
  }

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
          <SkeletonRootLayout userMenuComponents={userMenuComponents}>{children}</SkeletonRootLayout>
        </GlobalProvider>
      </body>
    </html>
  );
}
