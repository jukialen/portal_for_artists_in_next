'use client';

import { ReactNode } from 'react';
import { Accordion } from '@ark-ui/react/accordion';

import styles from './AccordionWrapper.module.scss';
import { LuChevronDown } from 'react-icons/lu';

export const AccordionWrapper = ({
  items,
}: {
  items: { value: '' | number; head: string; body: string | ReactNode }[];
}) => {
  return (
    <Accordion.Root collapsible multiple unmountOnExit defaultValue={['']} className={styles.accordionRoot}>
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.head} className={styles.accordionItem}>
          <Accordion.ItemTrigger className={styles.accordionButton}>
            <h3>{item.head}</h3>
            <LuChevronDown />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent className={styles.accordionBody}>{item.body}</Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};
