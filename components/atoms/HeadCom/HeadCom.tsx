import { useRouter } from 'next/router';
import { useHookSWR } from 'hooks/useHookSWR';
import Head from 'next/head';

type HeadComType = {
  path: string,
  content: string
}
export const HeadCom = ({ path, content }: HeadComType) => {
  const { locale } = useRouter();
  return (
    <Head>
      <link
        rel='alternate'
        hrefLang={locale}
        href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? path : `/${locale}${path}`}`}
      />
      <link rel="manifest" href="/manifest.json" />
      <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
      <meta name="theme-color" content="#FFD068" />
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta name='description' content={content} />
      <title>{useHookSWR()?.title}</title>
    </Head>
  )
}