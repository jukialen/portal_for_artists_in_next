import Image from 'next/image';

import { ArticleImgType } from 'types/global.types';

import { FileOptions } from 'components/atoms/FileOptions/FileOptions';

import styles from './Article.module.scss';


export const Article = ({ imgLink, imgDescription, authorName, unopt }: ArticleImgType) => {
  let img = 600;
 
  return (
    <div className={styles.article}>
      <Image className={styles.item} src={imgLink} alt={imgDescription} width={img} height={img} unoptimized={unopt} priority />
      <FileOptions authorName={authorName} />
    </div>
  );
};
