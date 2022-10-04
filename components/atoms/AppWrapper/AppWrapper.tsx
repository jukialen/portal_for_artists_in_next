import { FC } from 'react';

import styles from './AppWrapper.module.scss';

export const AppWrapper: FC = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.carousel}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
