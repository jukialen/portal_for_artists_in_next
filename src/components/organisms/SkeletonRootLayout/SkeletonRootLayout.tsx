'use client';

import { ReactElement, ReactNode, useContext } from 'react';

import { darkMode } from 'src/constants/links';

import { ModeContext } from 'src/providers/ModeProvider';
import { MenuContext } from 'src/providers/MenuProvider';

import styles from './SkeletonRootLayout.module.scss';

type ChildrenType = {
  children: ReactNode;
  userMenuComponents: { userHeader: ReactElement; header: ReactElement; aside: ReactElement };
};

export const SkeletonRootLayout = ({ children, userMenuComponents }: ChildrenType) => {
  const { isMenu } = useContext(MenuContext);
  const { isMode } = useContext(ModeContext);

  const userHeader = (): ReactElement => {
    return isMenu === 'true' ? userMenuComponents.userHeader : userMenuComponents.header;
  };
  
  // if (useCurrentUser(locale)) {
  //   return null;
  // }

  return (
    <div className={`${styles.whole__page} ${isMode === darkMode ? 'dark' : ''}`}>
      {userHeader()}

      <div className={styles.container}>
        {isMenu === 'true' && userMenuComponents.aside}

        <main
          className={`
              ${isMenu === 'true' ? styles.user__container : styles.main__container}
              ${isMode === darkMode ? 'main__container--dark' : ''}
            `}>
          <section className={styles.workspace}>{children}</section>
        </main>
      </div>
    </div>
  );
};
