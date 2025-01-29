'use client';

import { ReactElement, ReactNode, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { darkMode } from 'constants/links';
import { LangType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import styles from './SkeletonRootLayout.module.scss';

type ChildrenType = {
  children: ReactNode;
  session: boolean;
  userMenuComponents: { userHeader: ReactElement; header: ReactElement; aside: ReactElement };
  locale: LangType;
};

export const SkeletonRootLayout = ({ children, session, userMenuComponents, locale }: ChildrenType) => {
  const { isMode } = useContext(ModeContext);

  const { push } = useRouter();

  const pathname = usePathname();

  if (
    !session &&
    !(
      pathname === `/${locale}/` ||
      pathname === `/${locale}/signin` ||
      pathname === `/${locale}/signup` ||
      pathname === `/${locale}/forgotten` ||
      pathname === `/${locale}/new-password`
    )
  ) {
    push(`/${locale}/`);
  }

  if (
    session &&
    (pathname === `/${locale}/` ||
      pathname === `/${locale}/signin` ||
      pathname === `/${locale}/signup` ||
      pathname === `/${locale}/forgotten` ||
      pathname === `/${locale}/new-password`)
  ) {
    push(`/${locale}/app`);
  }

  return (
    <div className={`${styles.whole__page} ${isMode === darkMode ? 'dark' : ''}`}>
      {session ? userMenuComponents.userHeader : userMenuComponents.header}

      <div className={styles.container}>
        {session && userMenuComponents.aside}

        <main
          className={`
              ${session ? styles.user__container : styles.main__container}
              ${isMode === darkMode ? 'main__container--dark' : ''}
            `}>
          <section className={styles.workspace}>{children}</section>
        </main>
      </div>
    </div>
  );
};
