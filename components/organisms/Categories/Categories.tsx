import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import useSWR from 'swr';

import styles from './Categories.module.scss';

export const Categories = () => {
  const { locale, asPath } = useRouter();
// @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR(`/languages/${locale}.json`, fetcher);
  
  const [openSubCategories, setOpenCategories] = useState(false);
  const changeOpenCategories = () => setOpenCategories(!openSubCategories);
  
  return (
    <ol className={styles.categories}>
      <Link href='/#'>
        <a className={styles.link}>{data?.Aside?.all}</a>
      </Link>
      
      <li onClick={changeOpenCategories}>
        <Link href={`${asPath}/`}>
          <a className={styles.link}>{data?.Aside?.drawings}</a>
        </Link>
        <ol className={openSubCategories ? '' : styles.hiddenElement}>
          <Link href={`${locale}/drawings/:id`}>
            <a className={styles.link}>{data?.Aside?.realistic}</a>
          </Link>
          <Link href={`${locale}/drawings/:id`}>
            <a className={styles.link}>{data?.Aside?.manga}</a>
          </Link>
          <Link href={`${locale}/drawings/:id`}>
            <a className={styles.link}>{data?.Aside?.anime}</a>
          </Link>
          <Link href={`${locale}/drawings/:id`}>
            <a className={styles.link}>{data?.Aside?.comics}</a>
          </Link>
        </ol>
      </li>
      
      <Link href={`${locale}/photographs`}>
        <a className={styles.link}>{data?.Aside?.photographs}</a>
      </Link>
      <Link href={`${locale}/animations`}>
        <a className={styles.link}>{data?.Aside?.animations}</a>
      </Link>
      <Link href={`${locale}/others`}>
        <a className={styles.link}>{data?.Aside?.others}</a>
      </Link>
    </ol>
  );
}
