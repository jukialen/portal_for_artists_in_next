'use client';

import { ReactNode } from 'react';

import { getUserData } from "helpers/getUserData";

import styles from './PlanWrapper.module.scss';

export const PlanWrapper = ({ children }: { children: ReactNode }) => {
  const userData = getUserData();
  
  return <div className={userData?.pseudonym ? styles.plans__user : styles.plans}>{children}</div>;
};
