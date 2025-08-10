'use client';

import { ReactNode } from 'react';

import styles from './PlanWrapper.module.scss';

export const PlanWrapper = ({ children, pseudonym }: { children: ReactNode, pseudonym?: string }) => {
  return <div className={pseudonym ? styles.plans__user : styles.plans}>{children}</div>;
};
