import { ReactNode } from 'react';

import styles from './Wrapper.module.scss';

export const Wrapper = ({ children }: { children: ReactNode }) => {
  return <div className={styles.wrapper}>{children}</div>;
};
