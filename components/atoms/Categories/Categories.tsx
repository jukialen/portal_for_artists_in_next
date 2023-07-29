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

  const changeOpenCategories = () => setArrowIcon(!arrowIcon);

  const icons = 40;
  const arrowIcons = '1.5rem';

  return (
    <ol className={styles.categories}>
      <li className={styles.shadow}>
        <Link href={asPath} className={styles.withIcon} onClick={changeOpenCategories}>
          <p>{data?.Aside?.drawings}</p>
          {arrowIcon ? (
            <TriangleUpIcon w={arrowIcons} h={arrowIcons} />
          ) : (
            <TriangleDownIcon w={arrowIcons} h={arrowIcons} />
          )}
        </Link>

        <ol className={arrowIcon ? '' : styles.hiddenElement}>
          <Link href="/drawings/realistic" className={styles.containerImgLink}>
            <Image src={realistic} height={icons} width={icons} alt={data?.Aside?.realistic} />
            <p className={styles.link}>{data?.Aside?.realistic}</p>
          </Link>
          <Link href="/drawings/manga" className={styles.containerImgLink}>
            <Image src={manga} height={icons} width={icons} alt={data?.Aside?.manga} />
            <p className={styles.link}>{data?.Aside?.manga}</p>
          </Link>
          <Link href="https://www.freepik.com/vectors/poster" className={styles.source}>
            Poster vector created by gstudioimagen1 - www.freepik.com
          </Link>
          <Link href="/drawings/anime" className={styles.containerImgLink}>
            <Image src={anime} height={icons} width={icons} alt={data?.Aside?.anime} />
            <p className={styles.link}>{data?.Aside?.anime}</p>
          </Link>
          <Link href="/drawings/comics" className={styles.containerImgLink}>
            <Image src={comics} height={icons} width={icons} alt={data?.Aside?.comics} />
            <p className={styles.link}>{data?.Aside?.comics}</p>
          </Link>
        </ol>
      </li>

      <Link href="/photographs" className={`${styles.containerImgLink} ${styles.photographs}`}>
        <Image
          src={photograph}
          height={icons}
          width={icons}
          alt={`${data?.Aside?.photographs} Photo by Rirri on Unsplash`}
        />
        <p className={styles.link}>{data?.Aside?.photographs}</p>
      </Link>
      <Link href="/animations" className={styles.containerImgLink}>
        <Image
          src={animations}
          height={icons}
          width={icons}
          alt={`${data?.Aside?.photographs} Photo by Sebastian Svenson on Unsplash`}
        />
        <p className={styles.link}>{data?.Aside?.animations}</p>
      </Link>
      <Link href="/videos" className={styles.containerImgLink}>
        <Image
          src={videos}
          height={icons}
          width={icons}
          alt={`${data?.Aside?.photographs} Photo by Jakob Owens on Unsplash`}
        />
        <p className={styles.link}>{data?.Aside?.videos}</p>
      </Link>
      <Link href="/others" className={styles.containerImgLink}>
        <Image
          src={others}
          height={icons}
          width={icons}
          alt={`${data?.Aside?.photographs} Photo by Yong Chuan Tan on Unsplash`}
        />
        <p className={styles.link}>{data?.Aside?.others}</p>
      </Link>
    </ol>
  );
};
