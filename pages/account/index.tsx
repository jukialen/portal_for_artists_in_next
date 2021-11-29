import { GetServerSideProps } from "next";
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';

import { AccountMenu } from 'components/molecules/AccountMenu/AccountMenu';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { GalleryAccount } from 'components/organisms/GalleryAccount/GalleryAccount';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';

import styles from './index.module.scss';

export default function Account() {
  const { locale, asPath } = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR(`/languages/${locale}.json`, fetcher);
  
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
  };
  
  return {
    props: {}
  }
}
