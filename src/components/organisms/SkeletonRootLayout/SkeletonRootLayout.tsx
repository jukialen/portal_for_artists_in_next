'use client';

import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { darkMode } from 'constants/links';
import { LangType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import styles from './SkeletonRootLayout.module.scss';
import { usePathname } from "next/navigation";

type ChildrenType = {
  children: ReactNode;
  isUser: boolean;
  userMenuComponents: { userHeader: ReactElement; header: ReactElement; aside: ReactElement };
  locale: LangType;
};

export const SkeletonRootLayout = ({ children, isUser, userMenuComponents, locale }: ChildrenType) => {
  const { isMode } = useContext(ModeContext);
  const [checkUserAndPath, setCheckUserAndPath] = useState(true);
  const path = usePathname();
  const { push } = useRouter();
  
  const publicForAll = [
  '/settings',
  '/terms',
  '/privacy',
  '/contact',
  '/faq',
  '/plans',
];

const onlyForGuests = [
  '/',
  '/signin',
  '/signup',
  '/forgotten',
  '/new-password',
];

useEffect(() => {
  const normalize = (p: string) => p.endsWith('/') && p !== '/' ? p.slice(0, -1) : p;
  const isIn = (list: string[]) =>
    list.some(p =>
      normalize(path) === p ||
      normalize(path).startsWith(p + '/')
    );

  if (!isUser && !isIn(publicForAll) && !isIn(onlyForGuests)) {
    push('/signin');
    setCheckUserAndPath(false);
    return;
  }

  if (isUser && isIn(onlyForGuests)) {
    push('/app');
    setCheckUserAndPath(false);
    return;
  }

  setCheckUserAndPath(false);
}, [isUser, path, push]);
  
  return (
    <div className={`${styles.whole__page} ${isMode === darkMode ? 'dark' : ''}`}>
      { isUser ? userMenuComponents.userHeader : userMenuComponents.header}

      <div className={styles.container}>
        {isUser && userMenuComponents.aside}

        <main
          className={`
              ${isUser ? styles.user__container : styles.main__container}
              ${isMode === darkMode ? 'main__container--dark' : ''}
            `}>
          <section className={styles.workspace}>{checkUserAndPath ? <p className={styles.loading}>Loading...</p> : children}</section>
        </main>
      </div>
    </div>
  );
};
