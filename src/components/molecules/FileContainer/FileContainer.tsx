import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import { TagConstants } from 'constants/values';
import { ArticleVideosType } from 'types/global.types';

const DeletionFile = dynamic(() => import('../DeletionFile/DeletionFile').then((df) => df.DeletionFile));
import { FileOptions } from '../FileOptions/FileOptions';

import styles from './FileContainer.module.scss';

export const FileContainer = async ({
  name,
  fileUrl,
  authorName,
  authorId,
  shortDescription,
  tags,
  time,
  fileId,
  authorBool,
  profilePhoto,
  roleId,
}: ArticleVideosType) => {
  return (
    <div className={styles.file}>
      {authorBool && <DeletionFile fileId={fileId} />}

      {tags === TagConstants[TagConstants.findIndex((v) => v === 'videos')] ? (
        <video preload="metadata" controls className={styles.video} playsInline>
          <source src={fileUrl} />
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Sorry, your browser doesn\'t support embedded videos,
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          but don't worry, you can <Link href={fileUrl}>download it</Link>
          and watch it with your favorite video player!
        </video>
      ) : (
        <Image
          className={styles.item}
          src={fileUrl}
          alt={`File ${name} added by ${authorName} in Category: ${tags}`}
          unoptimized={`${tags}` === 'animations'}
          priority
        />
      )}
      <div className={styles.time}>{time}</div>

      <div className={styles.shortDescription}>{shortDescription}</div>
      <div>{tags}</div>

      <FileOptions
        fileId={fileId}
        authorName={authorName!}
        fileUrl={fileUrl}
        tags={tags!}
        name={name!}
        authorId={authorId}
        profilePhoto={profilePhoto}
        roleId={roleId!}
      />
    </div>
  );
};
