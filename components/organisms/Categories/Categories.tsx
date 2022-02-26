import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DataType } from 'types/global.types';

import styles from './Categories.module.scss';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

export const Categories = ({ data }: DataType) => {
  const { asPath } = useRouter();
  
  const [arrowIcon, setArrowIcon] = useState(false);
  const [openSubCategories, setOpenCategories] = useState(true);
  
  const changeOpenCategories = () => {
    setOpenCategories(!openSubCategories);
    setArrowIcon(!arrowIcon);
  };
  
  
  return (
    <ol className={styles.categories}>
      <Link href='/all'>
        <a className={styles.link}>{data?.Aside?.all}</a>
      </Link>
      
      <li className={styles.shadow }>
        <Link href={asPath}>
          <a
            className={`${styles.link} ${styles.withIcon} `}
            onClick={changeOpenCategories}
          ><p className={styles.p}>{data?.Aside?.drawings}</p>
            {arrowIcon ? <TriangleDownIcon w='1.5rem' h='1.5rem' className={styles.icons} /> :
              <TriangleUpIcon w='1.5rem' h='1.5rem' className={styles.icons} />}</a>
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
        <a className={`${styles.link} ${styles.photographs}`}>{data?.Aside?.photographs}</a>
      </Link>
      <Link href='/animations'>
        <a className={styles.link}>{data?.Aside?.animations}</a>
      </Link>
      <Link href='/movies'>
        <a className={styles.link}>{data?.Aside?.videos}</a>
      </Link>
      <Link href='/others'>
        <a className={styles.link}>{data?.Aside?.others}</a>
      </Link>
    </ol>
  );
}
