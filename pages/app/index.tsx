import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import useSWR from "swr";
import Cookies from 'js-cookie';

import { Wrapper } from 'components/organisms/Wrapper/Wrapper';

import styles from './index.module.scss';

export default function Application() {
  const router = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR(`/languages/${router.locale}.json`, fetcher);
  
  let user;
  
  useEffect(() => {
    user = Cookies.get('user');
    !user && router.push('/');
  }, [user]);
  
  return (
    <section className='workspace'>
      <Head>
        <link
          rel='alternate'
          hrefLang={router.locale}
          href={`${process.env.NEXT_PUBLIC_PAGE}${router.locale === 'en' ? '' : `/${router.locale}`}${router.asPath}`}
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