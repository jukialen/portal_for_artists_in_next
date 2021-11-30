import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from 'next/router';
import useSWR from "swr";

import { Wrapper } from 'components/organisms/Wrapper/Wrapper';

import styles from './index.module.scss';

export default function Application() {
  const { locale, asPath } = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data } = useSWR(`/languages/${locale}.json`, fetcher);
  
  return (
    <section className='workspace'>
      <Head>
        <link
          rel='alternate'
          hrefLang={locale}
          href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '' : `/${locale}`}${asPath}`}
        />
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='description' content='Main site for logged in users.' />
        <title>{data?.title}</title>
      </Head>
      
      
      <h2 className={styles.top__among__users}>{data?.App?.topAmongUsers}</h2>
      <Wrapper idWrapper='carouselTop' />
      <h2 className={styles.liked}>{data?.App?.liked}</h2>
      <Wrapper idWrapper='carouselLiked' />
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = req.headers.cookie;
  
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
