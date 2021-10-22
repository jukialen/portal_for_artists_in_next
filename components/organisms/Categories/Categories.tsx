import { useState } from 'react';

import Link from 'next/link';

import styles from './Categories.module.scss';

export const Categories = () => {
  const [openSubCategories, setOpenCategories] = useState(false);

  const changeOpenCategories = () => setOpenCategories(!openSubCategories);

  return (
    <ol className={styles.categories}>
      <Link href="#"><a className={styles.link}>Wszystko</a></Link>

      <li onClick={changeOpenCategories}>
        <Link href="#"><a className={styles.link}>Rysunki</a></Link>
        <ol className={openSubCategories ? '' : styles.hiddenElement}>
          <Link href="#"><a className={styles.link}>Realistyczne</a></Link>
          <Link href="#"><a className={styles.link}>Manga</a></Link>
          <Link href="#"><a className={styles.link}>Anime</a></Link>
          <Link href="#"><a className={styles.link}>Komiksy</a></Link>
        </ol>
      </li>

      <Link href="#"><a className={styles.link}>Fotografie</a></Link>
      <Link href="#"><a className={styles.link}>Animacje</a></Link>
      <Link href="#"><a className={styles.link}>Inne</a></Link>
    </ol>
  );
};
