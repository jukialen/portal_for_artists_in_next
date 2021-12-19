import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

import { useHookSWR } from '../../hooks/useHookSWR';

import { AccountMenu } from 'components/molecules/AccountMenu/AccountMenu';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { GalleryAccount } from 'components/organisms/GalleryAccount/GalleryAccount';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';

import styles from './index.module.scss';

export default function Account() {
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
        <meta name='description' content='Account portal site.' />
        <title>{data?.title}</title>
      </Head>
      
      <h2 className={styles.account__h2}>{data?.Nav?.account} {currentUser?.displayName}</h2>
      
      <AccountMenu data={data} />
      
      <AccountData data={data} />
      
      <GalleryAccount data={data} />
      
      <ProfileAccount data={data} />
    </section>
  ) : null
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const cookie = req.headers.cookie;
//
//   if (!cookie) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }
//
//   return {
//     props: {}
//   }
// }