import styles from './Videos.module.scss';

import { FileOptions } from 'components/atoms/FileOptions/FileOptions';

type VideoType = {
  link: string;
  authorName?: string
};

export const Videos = ({ link, authorName }: VideoType) => {
  return (
    <div className={styles.videos}>
      <video preload='metadata' controls className={styles.video} playsInline>
        <source src={link} />
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Sorry, your browser doesn't support embedded videos,
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        but don't worry, you can <a href={link}>download it</a>
        and watch it with your favorite video player!
      </video>
      <FileOptions authorName={authorName} />
    </div>
  )
}