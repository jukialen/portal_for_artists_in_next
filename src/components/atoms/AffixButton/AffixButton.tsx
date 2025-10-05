'use client';

import { useEffect, useState } from 'react';

import styles from './AffixButton.module.scss';
import { IoIosArrowUp } from 'react-icons/io';

export const AffixButton = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    if (typeof document !== 'undefined') {
      const scrolled = document.documentElement.scrollTop;
      scrolled > 300 ? setVisible(true) : setVisible(false);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <button className={styles.upBox} onClick={scrollToTop}>
      <IoIosArrowUp className={visible ? styles.up__active : styles.up} aria-label="top of page button" />
    </button>
  );
};
