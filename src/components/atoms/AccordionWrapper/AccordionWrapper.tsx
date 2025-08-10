'use client';

import { ReactNode, useState } from 'react';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'components/ui/accordion';

import styles from './AccordionWrapper.module.scss';

export const AccordionWrapper = ({
  items,
}: {
  items: { value: '' | number; head: string; body: string | ReactNode }[];
}) => {
  const [value, setValue] = useState(['']);

  return (
    <AccordionRoot
      collapsible
      multiple
      unmountOnExit
      defaultValue={['']}
      value={value}
      onValueChange={(e) => setValue(e.value)}
      className={styles.accordionRoot}>
      {items.map((item, index) => (
        <AccordionItem key={index} value={item.value.toString()} className={styles.accordionItem}>
          <h2>
            <AccordionItemTrigger className={styles.accordionButton}>{item.head}</AccordionItemTrigger>
            <AccordionItemContent className={styles.accordionBody}>{item.body}</AccordionItemContent>
          </h2>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
};
