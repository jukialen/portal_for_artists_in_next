import { ReactNode } from 'react';
import Script from 'next/script';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getStaticParams } from 'locales/server';

import { LangType } from 'types/global.types';
import { GTM_ID } from 'constants/links';

import { GlobalProvider } from 'providers/GlobalProvider';
import { Provider } from 'components/ui/provider';

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
  const locale = params.locale;
  const supabase = createServerComponentClient({ cookies });

  const userMenuComponents = {
    userHeader: <UserHeader locale={locale} />,
    header: <Header locale={locale} />,
    aside: <Aside />,
  };

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang={locale} suppressHydrationWarning>
      {process.env.NODE_ENV === 'production' && (
        <Script src={`https://cdn-cookieyes.com/client_data/${GTM_ID}/script.js`} strategy="beforeInteractive" />
      )}

      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://cdn-cookieyes.com/client_data/${GTM_ID}/script.js" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />

        <Provider>
          <GlobalProvider locale={locale}>
            <SkeletonRootLayout session={!!session} userMenuComponents={userMenuComponents} locale={locale}>
              {children}
            </SkeletonRootLayout>
          </GlobalProvider>
        </Provider>
      </body>
    </html>
  );
}
