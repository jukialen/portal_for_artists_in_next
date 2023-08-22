import { useContext } from 'react';
import Image from 'next/image';

import { ModeContext } from 'providers/ModeProvider';

import { ArticleVideosType } from 'types/global.types';

import { useUserData } from 'hooks/useUserData';
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
  const { isMode } = useContext(ModeContext);
  const { pseudonym } = useUserData();
  let img = 600;

  return (
    <div className={styles.article}>
      {pseudonym === authorName && <DeletionFile name={name!} />}
      <Image
        className={isMode ? styles.item : styles.item__dark}
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
