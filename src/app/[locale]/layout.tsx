import { ReactNode } from 'react';
import Script from 'next/script';
import SuperTokensWebJs from 'supertokens-web-js';
import ThirdPartyEmailPasswordWebJs from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import EmailVerification from 'supertokens-web-js/recipe/emailverification';
import Session from 'supertokens-web-js/recipe/session';

import { getStaticParams } from 'src/locales/server';

import { GlobalProvider } from 'src/providers/GlobalProvider';

import { UserHeader } from 'src/components/organisms/UserHeader/UserHeader';
import { Header } from 'src/components/organisms/Header/Header';
import { Aside } from 'src/components/organisms/Aside/Aside';
import { SkeletonRootLayout } from 'src/components/organisms/SkeletonRootLayout/SkeletonRootLayout';

import 'src/styles/reset.scss';
import 'src/styles/global.scss';
import 'src/styles/darkLightMode.scss';

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
    SuperTokensWebJs.init({
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
