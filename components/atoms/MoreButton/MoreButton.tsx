import { Button } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';
import { MouseEventHandler } from 'react';

import styles from './MoreButton.module.scss';

type MoreType = {
  nextElements: MouseEventHandler<HTMLButtonElement> | undefined
}
export const MoreButton = (nextElements: MoreType) => {
  const data = useHookSWR();
  
  return <Button
    className={styles.nextButton}
    variant='outline'
    colorScheme='blue'
    width='8rem'
    borderColor='#4F8DFF'
    _hover={{ backgroundColor: '#4F8DFF' }}
    // @ts-ignore
    onClick={nextElements}
  >
    {data?.Groups?.list?.more}
  </Button>
}