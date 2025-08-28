'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { Avatar } from 'components/atoms/Avatar/Avatar';

import { FilesCommentsType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';
import { SubComments } from 'components/molecules/SubComments/SubComments';

import styles from './FileComment.module.scss';

export const FileComment = ({
  fileCommentId,
  fileId,
  content,
  authorId,
  authorName,
  authorProfilePhoto,
  liked,
  likes,
  roleId,
  date,
}: FilesCommentsType) => {
  const { del } = useContext(DCContext);

  return (
    <div className={del ? styles.container__deleted : styles.container}>
      <div className={styles.comment}>
        <Avatar src={authorProfilePhoto} fallbackName={authorName} alt="author profile photo icon" />
        <div className={styles.rightSideComment}>
          <div className={styles.topPartComment}>
            <p className={styles.pseudonym}>
              <Link href={`/user/${authorName}`}>{authorName}</Link>
            </p>
            <p className={styles.date}>{date}</p>
          </div>
          <h2 className={styles.text}>{content}</h2>
        </div>
      </div>
      <OptionsComments
        fileId={fileId}
        fileCommentId={fileCommentId}
        authorId={authorId}
        userId={authorId}
        liked={liked}
        likes={likes}
        tableName="FilesComments">
        <NewComments
          fileId={fileId}
          fileCommentId={fileCommentId}
          authorId={authorId}
          profilePhoto={authorProfilePhoto}
          roleId={roleId!}
        />
        <SubComments fileCommentId={fileCommentId} fileId={fileId} />
      </OptionsComments>
    </div>
  );
};
