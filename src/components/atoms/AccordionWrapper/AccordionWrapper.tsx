'use client';

import { ReactNode, useContext, useState } from 'react';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'components/ui/accordion';
import { ModeContext } from 'providers/ModeProvider';

import { darkMode } from 'constants/links';

import styles from './AccordionWrapper.module.scss';

export const AccordionWrapper = ({
  items,
}: {
  items: { value: '' | number; head: string; body: string | ReactNode }[];
}) => {
  const [value, setValue] = useState(['']);
  const { isMode } = useContext(ModeContext);

  const backgroundColor = 'transparent';
  const color = isMode === darkMode ? '#f7f7f7' : '#2D3748';
  const m = '2rem 0';

  return (
    <AccordionRoot
      collapsible
      multiple
      unmountOnExit
      defaultValue={['']}
      value={value}
      onValueChange={(e) => setValue(e.value)}
      width="95vw"
      maxW="26rem"
      justifyContent="space-around"
      alignSelf="center"
      >
        {items.map((item, index) => (
          <AccordionItem key={index} value={item.value.toString()} margin={m} backgroundColor={backgroundColor} color={color}>
            <h2>
              <AccordionItemTrigger className={styles.accordionButton}>{item.head}</AccordionItemTrigger>
              <AccordionItemContent color={color}>{item.body}</AccordionItemContent>
            </h2>
          </AccordionItem>
        ))}
    </AccordionRoot>
  );
};
