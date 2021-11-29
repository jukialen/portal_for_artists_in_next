import { GetServerSideProps } from 'next'
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";

import { Wrapper } from "components/organisms/Wrapper/Wrapper";
import { useEffect } from "react";

type DrawingsType = {
  context: string,
  multimedia: string,
  description: string,
  username: string,
  tags: string
}

export default function Drawings() {
  const { locale, asPath } = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data } = useSWR(`/languages/${locale}.json`, fetcher);
  
  return (
    <div className='workspace'>
      <Head>
        <link
          rel='alternate'
          hrefLang={locale}
          href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '' : `/${locale}`}${asPath}`}
        />
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='description' content='Main site.' />
        <title>{data?.title}</title>
      </Head>
      <h1>podstrona z rysunkami</h1>
      <Wrapper idWrapper='drawingsWrapper' />
    </div>
  )
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = await req.cookies;
  
  if (!cookie) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  
  return {
    props: {}
  }
}