import styles from './Article.module.scss';
import Image from 'next/image';

type articleImg = {
  imgLink: string;
  imgDescription: string;
  authorName: string;
};

export const Article = ({ imgLink, imgDescription, authorName }: articleImg) => {
  return (
    <article className={styles.article}>
      <Image className={styles.item} src={imgLink} alt={imgDescription} width='280' height='280' />
      <div className={styles.author__name}>
        <a href='#'>{authorName}</a>
      </div>
      <div className={styles.share__options}>
        <a
          href='https://www.facebook.com'
          className={styles.icon}
          target='_blank'
          rel='noreferrer'
        >
          <Image src={'/faceebook'} layout='fill' />
        </a>
        <a
          href='https://www.twitter.com'
          className={styles.icon}
          target='_blank'
          rel='noreferrer'
        >
          <Image src={'/twitter.svg'} layout='fill' />
        </a>
        <a
          href='https://www.discord.com'
          className={styles.icon}
          target='_blank'
          rel='noreferrer'
        >
          <Image src={'/faceebook.svg'} layout='fill' />
        </a>
        <a href='#' className={styles.icon}>
          <Image src={'/faceebook.svg'} layout='fill' />
        </a>
      </div>
    </article>
  );
};
