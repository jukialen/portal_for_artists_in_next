import Link from 'next/link';
import { StaticImageData } from 'next/image';
import { getScopedI18n } from 'locales/server';

import { ContainerLink } from 'components/ui/atoms/ContainerLink/ContainerLink';

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
          {imgDrawingSources.map((s, i) => (
            <ContainerLink
              link={`/drawings/${s.name}`}
              name={tAside(s.name)}
              description=""
              logo={s.source}
              alt={tAside(s.name)}
              key={i}
            />
          ))}
          <Link href="https://www.freepik.com/vectors/poster" className={`${styles.source} ${styles.drawings}`}>
            Poster vector created by gstudioimagen1 - www.freepik.com
          </Link>
        </section>
      </details>

      <ContainerLink
        link="/photographs"
        name={tAside('photographs')}
        description=""
        logo={photograph}
        alt={`${tAside('photographs')} Photo by Rirri on Unsplash`}
      />

      <ContainerLink
        link="/animations"
        name={tAside('animations')}
        description=""
        logo={animations}
        alt={`${tAside('photographs')} Photo by Sebastian Svenson on Unsplash`}
      />

      <ContainerLink
        link="/videos"
        name={tAside('videos')}
        description=""
        logo={videos}
        alt={`${tAside('photographs')} Photo by Jakob Owens on Unsplash`}
      />
    </article>
  );
};
