import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";

import styles from './Categories.module.scss';

export const Categories = ({ data }: any) => {
  const { asPath } = useRouter();
  
  const [openSubCategories, setOpenCategories] = useState(false);
  const changeOpenCategories = () => setOpenCategories(!openSubCategories);
  
  
  return (
    <ol className={styles.categories}>
      <Link href='/all'>
        <a className={styles.link}>{data?.Aside?.all}</a>
      </Link>
      
      <li onClick={changeOpenCategories}>
        <Link href={asPath}>
          <a className={styles.link}>{data?.Aside?.drawings}</a>
        </Link>
        <ol className={openSubCategories ? '' : styles.hiddenElement}>
          <Link href='/drawings/realistic'>
            <a className={styles.link}>{data?.Aside?.realistic}</a>
          </Link>
          <Link href='/drawings/manga'>
            <a className={styles.link}>{data?.Aside?.manga}</a>
          </Link>
          <Link href='/drawings/anime'>
            <a className={styles.link}>{data?.Aside?.anime}</a>
          </Link>
          <Link href='/drawings/comics'>
            <a className={styles.link}>{data?.Aside?.comics}</a>
          </Link>
        </ol>
      </li>
      
      <Link href='/photographs'>
        <a className={styles.link}>{data?.Aside?.photographs}</a>
      </Link>
      <Link href='/animations'>
        <a className={styles.link}>{data?.Aside?.animations}</a>
      </Link>
      <Link href='/others'>
        <a className={styles.link}>{data?.Aside?.others}</a>
      </Link>
    </ol>
  );
}
