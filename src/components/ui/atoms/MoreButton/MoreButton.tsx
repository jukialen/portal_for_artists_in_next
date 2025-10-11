'use client';

import { MouseEventHandler } from 'react';

import { useScopedI18n } from 'locales/client';

import styles from './MoreButton.module.scss';

type MoreType = { nextElementsAction: MouseEventHandler };

export const MoreButton = ({ nextElementsAction }: MoreType) => {
  const tGroups = useScopedI18n('Groups.list');

  return (
    <button className={styles.nextButton} onClick={nextElementsAction}>
      {tGroups('more')}
    </button>
  );
};
