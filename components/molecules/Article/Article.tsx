import styles from './Article.module.scss';
import { Image } from 'antd';

type articleImg = {
  imgLink: string;
  imgDescription: string;
  authorName: string;
};

export const Article = ({ imgLink, imgDescription, authorName }: articleImg) => {
  return (
    <article className={styles.article}>
      <Image className={styles.item} src={imgLink} alt={imgDescription} />
      <div className={styles.author__name}>
        <a href="#">{authorName}</a>
      </div>
      <div className={styles.share__options}>
        <a
          href="https://www.facebook.com"
          className={styles.facebook__icon}
          target="_blank"
          rel="noreferrer"
        />
        <a
          href="https://www.twitter.com"
          className={styles.twitter__icon}
          target="_blank"
          rel="noreferrer"
        />
        <a
          href="https://www.discord.com"
          className={styles.discord__icon}
          target="_blank"
          rel="noreferrer"
        />
        <a href="#" className={styles.copy__icon} />
      </div>
    </article>
  );
};
