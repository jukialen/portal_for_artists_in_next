import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { getScopedI18n } from 'locales/server';

import styles from './Categories.module.css';
import realistic from '../../../../../public/realistic.jpg';
import manga from '../../../../../public/manga.jpg';
import anime from '../../../../../public/anime.jpg';
import comics from '../../../../../public/comics.jpg';
import photograph from '../../../../../public/photograph.jpg';
import animations from '../../../../../public/animations.jpg';
import videos from '../../../../../public/videos.jpg';
import { RiArrowDownSLine } from 'react-icons/ri';

export const Categories = async () => {
  const tAside = await getScopedI18n('Aside');

  type ImgSourceType = {
    name: 'realistic' | 'manga' | 'anime' | 'comics';
    source: StaticImageData;
  };
  const imgDrawingSources: ImgSourceType[] = [
    { name: 'realistic', source: realistic },
    { name: 'manga', source: manga },
    { name: 'anime', source: anime },
    { name: 'comics', source: comics },
  ];

  return (
    <article className={styles.categories}>
      <details className={styles.shadow}>
        <summary className={styles.withIcon}>
          <p>{tAside('drawings')}</p>
          <RiArrowDownSLine className={styles.categoryArrow} />
        </summary>
        <section>
          {imgDrawingSources.map((s) => (
            <Link href={`/drawings/${s.name}`} className={`${styles.containerImgLink} ${styles.drawings}`} key={s.name}>
              <Image src={s.source} alt={tAside(s.name)} />
              <p className={styles.link}>{tAside(s.name)}</p>
            </Link>
          ))}
          <Link href="https://www.freepik.com/vectors/poster" className={`${styles.source} ${styles.drawings}`}>
            Poster vector created by gstudioimagen1 - www.freepik.com
          </Link>
        </section>
      </details>

      <Link href="/photographs" className={`${styles.containerImgLink} ${styles.photographs}`}>
        <Image src={photograph} alt={`${tAside('photographs')} Photo by Rirri on Unsplash`} />
        <p className={styles.link}>{tAside('photographs')}</p>
      </Link>
      <Link href="/animations" className={styles.containerImgLink}>
        <Image src={animations} alt={`${tAside('photographs')} Photo by Sebastian Svenson on Unsplash`} />
        <p className={styles.link}>{tAside('animations')}</p>
      </Link>
      <Link href="/videos" className={styles.containerImgLink}>
        <Image src={videos} alt={`${tAside('photographs')} Photo by Jakob Owens on Unsplash`} />
        <p className={styles.link}>{tAside('videos')}</p>
      </Link>
    </article>
  );
};
