import Image from 'next/image';

import { ArticleVideosType } from 'types/global.types';

import { FileOptions } from 'components/molecules/FileOptions/FileOptions';
import { DeletionFile } from 'components/molecules/DeletionFile/DeletionFile';

import styles from './Article.module.scss';

export const Article = ({
  fileId,
  name,
  fileUrl,
  authorName,
  profilePhoto,
  shortDescription,
  tags,
  time,
}: ArticleVideosType) => {
  let img = 600;

  return (
    <div className={styles.article}>
      <DeletionFile name={name!} authorName={authorName} />
      <Image
        className={styles.item}
        src={fileUrl}
        alt={`File ${name} added by ${authorName} in Category: ${tags}`}
        width={img}
        height={img}
        unoptimized={`${tags}` === 'animations'}
        priority
      />
      <div className={styles.time}>{time}</div>

      <div className={styles.shortDescription}>{shortDescription}</div>

      <FileOptions fileId={fileId} authorName={authorName!} profilePhoto={profilePhoto} tags={tags!} name={name!} />
    </div>
  );
};
