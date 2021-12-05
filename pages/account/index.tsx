import { GetServerSideProps } from "next";
import { useRouter } from 'next/router';
import Head from 'next/head';

import { AccountMenu } from 'components/molecules/AccountMenu/AccountMenu';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { GalleryAccount } from 'components/organisms/GalleryAccount/GalleryAccount';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';

import styles from './index.module.scss';
import { useHookSWR } from '../../hooks/useHookSWR';

export default function Account() {
  const { locale, asPath } = useRouter();
  
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
        <title>{useHookSWR()?.title}</title>
      </Head>
      
      <h2 className={styles.account__h2}>{useHookSWR()?.Nav?.account}</h2>
      
      <AccountMenu data={useHookSWR()} />
      
      <AccountData data={useHookSWR()} />
      
      <GalleryAccount data={useHookSWR()} />
      
      <ProfileAccount data={useHookSWR()} />
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
