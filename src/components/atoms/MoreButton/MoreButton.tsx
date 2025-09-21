'use client';

import { MouseEventHandler, useContext } from 'react';
import { Button } from '@chakra-ui/react';

import { darkMode } from 'constants/links';

import { useScopedI18n } from 'locales/client';

import { ModeContext } from 'providers/ModeProvider';

import styles from './MoreButton.module.scss';

type MoreType = {
  // @ts-ignore
  nextElementsAction: MouseEventHandler;
};
export const MoreButton = ({ nextElementsAction }: MoreType) => {
  const { isMode } = useContext(ModeContext);

  const tGroups = useScopedI18n('Groups.list');

  return (
    <Button
      className={styles.nextButton}
      variant="outline"
      colorScheme="blue"
      width="8rem"
      borderColor="#4F8DFF"
      _hover={{ backgroundColor: '#4F8DFF', color: `${isMode !== darkMode ? '#0E2143' : ''}` }}
      onClick={nextElementsAction}>
      {tGroups('more')}
    </Button>
  );
};
