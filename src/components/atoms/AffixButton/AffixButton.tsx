'use client';

import { MouseEventHandler, useEffect, useState } from 'react';

import styles from './AffixButton.module.scss';
import { IoIosArrowUp } from 'react-icons/io';
import { Box, Link } from '@chakra-ui/react';

export const AffixButton = () => {
  const [bottom, setBottom] = useState<number>(0);

  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    let scrolled;
    if (typeof document !== 'undefined') {
      scrolled = document.documentElement.scrollTop;
      scrolled > 300 ? setVisible(true) : setVisible(false);
    }
  };

  const changeBottom: MouseEventHandler = () => setBottom(0);

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <Box className={styles.upBox} bottom={bottom}>
      <Link type="primary" href="#" onClick={changeBottom}>
        <IoIosArrowUp className={visible ? styles.up__active : styles.up} aria-label="top of page button" />
      </Link>
    </Box>
  );
};
