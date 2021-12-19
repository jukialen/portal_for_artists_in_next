import Head from "next/head";
import { useRouter } from 'next/router';
import { auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";

import { useHookSWR } from 'hooks/useHookSWR';

import { Wrapper } from 'components/organisms/Wrapper/Wrapper';

import styles from './index.module.scss';
import { useState } from 'react';

export default function Application() {
  const { push, locale, asPath } = useRouter();
  
  const [loading, setLoading] = useState(true);
  
  const currentUser = auth.currentUser;
  const data = useHookSWR();
  
  onAuthStateChanged(auth, (user) => {
    user ? setLoading(false) : push('/');
  });
  
  return !loading ? (
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
  ) : null;
};