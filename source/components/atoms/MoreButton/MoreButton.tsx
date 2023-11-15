import { Button } from '@chakra-ui/react';

<<<<<<< Updated upstream:components/atoms/MoreButton/MoreButton.tsx
import { useHookSWR } from 'hooks/useHookSWR';
import { MouseEventHandler, useContext } from 'react';

import { darkMode } from 'utilites/constants';
=======
import { darkMode } from 'source/constants/links';

import { useScopedI18n } from 'source/locales/client';
>>>>>>> Stashed changes:source/components/atoms/MoreButton/MoreButton.tsx

import { ModeContext } from 'source/providers/ModeProvider';

import styles from './MoreButton.module.scss';

type MoreType = {
  nextElements: MouseEventHandler;
};
export const MoreButton = ({ nextElements }: MoreType) => {
  const data = useHookSWR();
  const { isMode } = useContext(ModeContext);

  return (
    <Button
      className={styles.nextButton}
      variant="outline"
      colorScheme="blue"
      width="8rem"
      borderColor="#4F8DFF"
      _hover={{ backgroundColor: '#4F8DFF', color: `${isMode !== darkMode ? '#0E2143' : ''}` }}
      onClick={nextElements}>
      {data?.Groups?.list?.more}
    </Button>
  );
};
