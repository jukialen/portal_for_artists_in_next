import { Layout } from 'layout/Layout'

import 'styles/darkLightMode.scss';
import './_app.scss';

// @ts-ignore
export default function MyApp({ Component, pageProps }) {
  return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
  )
}

