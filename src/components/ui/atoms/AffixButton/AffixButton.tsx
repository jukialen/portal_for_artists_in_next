'use client';

import { useEffect, useState } from 'react';

import styles from './AffixButton.module.scss';
import { IoIosArrowUp } from 'react-icons/io';

export const AffixButton = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    setVisible(scrolled > 300);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <button className={visible ? styles.upBox__active : styles.upBox} onClick={scrollToTop}>
      <IoIosArrowUp className={styles.up} aria-label="top of page button" />
    </button>
  );
};
