import styles from './Article.module.scss';
import Image from 'next/image';

type articleImg = {
  imgLink: string;
  imgDescription: string;
  authorName: string;
};

const icon = 30;

export const Article = ({ imgLink, imgDescription, authorName }: articleImg) => {
  return (
    <article className={styles.article}>
      <Image className={styles.item} src={imgLink} alt={imgDescription} width='280' height='280' />
      <div className={styles.bottomPanel}>
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
            <Image src='/facebook.svg' width={icon} height={icon} aria-label='facebook icon' />
          </a>
          <a
            href='https://www.twitter.com'
            className={styles.icon}
            target='_blank'
            rel='noreferrer'
          >
            <Image src='/twitter.svg' width={icon} height={icon} aria-label='twitter icon' />
          </a>
          <a
            href='https://www.discord.com'
            className={styles.icon}
            target='_blank'
            rel='noreferrer'
          >
            <Image src='/discord.svg' width={icon} height={icon} aria-label='discord icon' />
          </a>
          <a href='#' className={styles.icon}>
            <Image src='/copy.svg' width={icon} height={icon} aria-label='copy icon' />
          </a>
        </div>
      </div>
    </article>
  );
};
