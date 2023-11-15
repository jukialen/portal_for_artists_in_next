'use client';

import { ReactNode } from 'react';

import { useUserData } from "source/hooks/useUserData";

import styles from './PlanWrapper.module.scss';

export const PlanWrapper = ({ children }: { children: ReactNode }) => {
  const userData = useUserData();
  
  return <div className={userData?.pseudonym ? styles.plans__user : styles.plans}>{children}</div>;
};
