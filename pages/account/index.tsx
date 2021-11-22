import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import Cookies from 'js-cookie';

import { AccountMenu } from 'components/molecules/AccountMenu/AccountMenu';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { GalleryAccount } from 'components/organisms/GalleryAccount/GalleryAccount';

import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';
import styles from './index.module.scss';

export default function Account() {
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
        <meta name='description' content='Account portal site.' />
        <title>{data?.title}</title>
      </Head>
      
      <h2 className={styles.account__h2}>{data?.Nav?.account}</h2>
      
      <AccountMenu data={data} />
      
      <AccountData data={data} />
      
      <GalleryAccount data={data} />
      
      <ProfileAccount data={data} />
    </section>
  );
}
