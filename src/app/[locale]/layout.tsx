import { ReactNode } from 'react';
import { Viewport } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';

import { getStaticParams } from 'locales/server';

import { GTM_ID } from 'constants/links';
import { LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';

import { ModeProvider } from 'providers/ModeProvider';

import { UserHeader } from 'components/organisms/UserHeader/UserHeader';
import { Header } from 'components/organisms/Header/Header';
import { Aside } from 'components/organisms/Aside/Aside';

import styles from './Layout.module.scss';
import 'styles/reset.scss';
import 'styles/global.scss';
import 'styles/_variables.scss';

type ChildrenType = {
  children: ReactNode;
  params: Promise<{ locale: LangType }>;
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(0, 0%, 97%, 0.9)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsla(0, 0%, 97%, 0.1)' },
  ],
};

export function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({ children, params }: ChildrenType) {
  const { locale } = await params;

  const userMenuComponents = {
    userHeader: <UserHeader />,
    header: <Header locale={locale} />,
    aside: <Aside />,
  };

  const user = await getUserData();

  return (
    <html lang={locale} suppressHydrationWarning>
      {!!GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}

      <body>
        <ModeProvider locale={locale}>
          <div className={styles.whole__page}>
            {!!user ? userMenuComponents.userHeader : userMenuComponents.header}

            <div className={styles.container}>
              {!!user && userMenuComponents.aside}

              <main className={!!user ? styles.user__container : styles.main__container}>
                <section className={styles.workspace}>{children}</section>
              </main>
            </div>
          </div>
        </ModeProvider>
      </body>
    </html>
  );
}
