import styles from './Videos.module.scss';

type VideoType = {
  link: string
};

export const Videos = ({ link }: VideoType) => {
  const size = 272;
  
  return (
    <div className={styles.videos}>
      <video preload='metadata' controls width={size} height={size} playsInline>
        <source src={link} />
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Sorry, your browser doesn't support embedded videos,
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        but don't worry, you can <a href={link}>download it</a>
        and watch it with your favorite video player!
      </video>
    </div>
  )
}