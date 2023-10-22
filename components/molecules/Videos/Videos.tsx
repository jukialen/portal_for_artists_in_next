import Link from 'next/link';

import { ArticleVideosType } from 'types/global.types';

import { DeletionFile } from 'components/molecules/DeletionFile/DeletionFile';
import { FileOptions } from 'components/molecules/FileOptions/FileOptions';

import styles from './Videos.module.scss';

export const Videos = ({ name, fileUrl, authorName, tags, fileId, profilePhoto }: ArticleVideosType) => {

  return (
    <div className={styles.videos}>
      <DeletionFile name={name!} authorName={authorName} />

      <video preload="metadata" controls className={styles.video} playsInline>
        <source src={fileUrl} />
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Sorry, your browser doesn't support embedded videos,
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        but don't worry, you can <Link href={fileUrl}>download it</Link>
        and watch it with your favorite video player!
      </video>

      <FileOptions authorName={authorName!} profilePhoto={profilePhoto} tags={tags!} name={name!} fileId={fileId} />
    </div>
  );
};
