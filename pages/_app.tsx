import { AppProps } from "next/app";
import { NextPage } from "next";

import { Layout } from 'layout/Layout'

import { ModeProvider } from "../providers/ModeProvider";

import 'styles/darkLightMode.scss';
import './_app.scss';
import { StatusLoginProvider } from "../providers/StatusLogin";

type AppPropsWithLayout = AppProps & {
  Component: NextPage
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <ModeProvider>
      <StatusLoginProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StatusLoginProvider>
    </ModeProvider>
  )
};
