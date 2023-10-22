import { ReactNode } from "react";

import styles from './AppWrapper.module.scss';

export const AppWrapper = ({ children }: { children: ReactNode}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.carousel}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
