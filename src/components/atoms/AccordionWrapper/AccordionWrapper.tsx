'use client';

import { ReactNode, SetStateAction, useContext, useState } from 'react';
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
      onValueChange={(e: { value: { toString: () => SetStateAction<string[]> } }) => setValue(e.value.toString())}
      width="95vw"
      maxW="26rem"
      justifyContent="space-around"
      alignSelf="center"
      m>
      <AccordionItem margin={m} backgroundColor={backgroundColor} color={color}>
        <AccordionItemTrigger />
        {items.map((item, index) => (
          <AccordionItem key={index} value={item.value}>
            <h2>
              <AccordionItemTrigger className={styles.accordionButton}>{item.head}</AccordionItemTrigger>
              <AccordionItemContent color={color}>{item.body}</AccordionItemContent>
            </h2>
          </AccordionItem>
        ))}
      </AccordionItem>
    </AccordionRoot>
  );
};
