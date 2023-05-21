import { AppProps } from 'next/app';
import { NextPage } from 'next';
import Script from 'next/script';
import ThirdPartyEmailPasswordWebJs from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import SuperTokensWebJs from 'supertokens-web-js';
import EmailVerification from 'supertokens-web-js/recipe/emailverification';
import Session from 'supertokens-web-js/recipe/session';

import { Layout } from 'layout/Layout';

import { ModeProvider } from 'providers/ModeProvider';
import { StatusLoginProvider } from 'providers/StatusLogin';

import 'styles/darkLightMode.scss';
import './_app.scss';

type AppPropsWithLayout = AppProps & {
  Component: NextPage;
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

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <ModeProvider>
      <StatusLoginProvider>
        <Layout>
          {/* <!-- Google Tag Manager -->  */}
          <Script
            id="gtm"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-THTTL3P');`,
            }}></Script>
          {/* <!-- End Google Tag Manager --> */}
          <Component {...pageProps} />
        </Layout>
      </StatusLoginProvider>
    </ModeProvider>
  );
}
