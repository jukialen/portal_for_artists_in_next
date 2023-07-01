import { AppProps } from 'next/app';
import { NextPage } from 'next';
import ThirdPartyEmailPasswordWebJs from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import SuperTokensWebJs from 'supertokens-web-js';
import EmailVerification from 'supertokens-web-js/recipe/emailverification';
import Session from 'supertokens-web-js/recipe/session';

import { Layout } from 'layout/Layout';

import { ModeProvider } from 'providers/ModeProvider';

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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ModeProvider>
  );
}
