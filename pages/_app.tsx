import {AppProps} from "next/app";
import {NextPage} from "next";

import { Layout } from 'layout/Layout'

import { ModeProvider } from "../providers/ModeProvider";

import 'styles/darkLightMode.scss';
import './_app.scss';

type AppPropsWithLayout = AppProps & {
    Component: NextPage
}

 export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return (
      <ModeProvider>
          <Layout>
              <Component {...pageProps} />
          </Layout>
      </ModeProvider>
  )
};
