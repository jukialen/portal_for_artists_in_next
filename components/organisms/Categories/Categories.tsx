import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { DataType } from 'types/global.types';

import styles from './Categories.module.scss';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import realistic from 'public/realistic.jpg';
import manga from 'public/manga.jpg';
import anime from 'public/anime.jpg';
import comics from 'public/comics.jpg';
import photograph from 'public/photograph.jpg';
import animations from 'public/animations.jpg';
import videos from 'public/videos.jpg';
import others from 'public/others.jpg';

export const Categories = ({ data }: DataType) => {
  const { asPath } = useRouter();
  
  const [arrowIcon, setArrowIcon] = useState(false);
  const [openSubCategories, setOpenCategories] = useState(true);
  
  const changeOpenCategories = () => {
    setOpenCategories(!openSubCategories);
    setArrowIcon(!arrowIcon);
  };
  
  const icons = 55;
  
  return (
    <ol className={styles.categories}>
      <li className={styles.shadow}>
        <Link href={asPath}>
          <a
            className={`${styles.link} ${styles.withIcon}`}
            onClick={changeOpenCategories}
          >
            <p className={styles.p}>
              {data?.Aside?.drawings}
            </p>
            {arrowIcon ? <TriangleDownIcon w='1.5rem' h='1.5rem' className={styles.icons} /> :
              <TriangleUpIcon w='1.5rem' h='1.5rem' className={styles.icons} />}</a>
        </Link>
        
        <ol className={openSubCategories ? '' : styles.hiddenElement}>
          <div className={styles.containerImgLink}>
            <Image src={realistic} height={icons} width={icons} alt={data?.Aside?.realistic} />
            <Link href='/drawings/realistic'>
              <a className={styles.link}>{data?.Aside?.realistic}</a>
            </Link>
          </div>
          <div className={styles.containerImgLink}>
            <Image src={manga} height={icons} width={icons} alt={data?.Aside?.manga} />
            <Link href='/drawings/manga'>
              <a className={styles.link}>{data?.Aside?.manga}</a>
            </Link>
            <a
              href='https://www.freepik.com/vectors/poster'
              className={styles.source}
            >
              Poster vector created by gstudioimagen1 - www.freepik.com
            </a>
          </div>
          <div className={styles.containerImgLink}>
            <Image src={anime} height={icons} width={icons} alt={data?.Aside?.anime} />
            <Link href='/drawings/anime'>
              <a className={styles.link}>{data?.Aside?.anime}</a>
            </Link>
          </div>
          <div className={styles.containerImgLink}>
            <Image src={comics} height={icons} width={icons} alt={data?.Aside?.comics} />
            <Link href='/drawings/comics'>
              <a className={styles.link}>{data?.Aside?.comics}</a>
            </Link>
          </div>
        </ol>
      </li>
      
      <div className={`${styles.containerImgLink} ${styles.photographs}`}>
        <Image
          src={photograph}
          height={icons}
          width={icons}
          alt={`${data?.Aside?.photographs} Photo by Rirri on Unsplash`}
        />
        <Link href='/photographs'>
          <a className={styles.link}>{data?.Aside?.photographs}</a>
        </Link>
      </div>
      <div className={`${styles.containerImgLink} ${styles.photographs}`}>
        <Image
          src={animations}
          height={icons}
          width={icons}
          alt={`${data?.Aside?.photographs} Photo by Sebastian Svenson on Unsplash`}
        />
        <Link href='/animations'>
          <a className={styles.link}>{data?.Aside?.animations}</a>
        </Link>
      </div>
      <div className={`${styles.containerImgLink} ${styles.photographs}`}>
        <Image
          src={videos}
          height={icons}
          width={icons}
          alt={`${data?.Aside?.photographs} Photo by Jakob Owens on Unsplash`}
        />
        <Link href='/videos'>
          <a className={styles.link}>{data?.Aside?.videos}</a>
        </Link>
      </div>
      <div className={`${styles.containerImgLink} ${styles.photographs}`}>
        <Image
          src={others}
          height={icons}
          width={icons}
          alt={`${data?.Aside?.photographs} Photo by Yong Chuan Tan on Unsplash`}
        />
      <Link href='/others'>
        <a className={styles.link}>{data?.Aside?.others}</a>
      </Link>
      </div>
    </ol>
  );
}
