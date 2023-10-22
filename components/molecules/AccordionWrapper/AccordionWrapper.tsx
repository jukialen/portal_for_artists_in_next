'use client';

import { Accordion } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const AccordionWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Accordion
      defaultIndex={[0]}
      allowMultiple
      width="95vw"
      maxW="26rem"
      justifyContent="space-around"
      alignSelf="center"
      m="2rem 0">
      {children}
    </Accordion>
  );
};
