'use client';

import { useContext } from 'react';
import Link from 'next/link';

import { supabaseStorageProfileUrl } from 'constants/links';
import { FilesCommentsType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

import { Avatar } from 'components/ui/atoms/Avatar/Avatar';
import { OptionsComments } from 'components/functional/molecules/OptionsComments/OptionsComments';
import { SubComments } from 'components/functional/molecules/SubComments/SubComments';

import styles from './FileComment.module.scss';

export const FileComment = ({ fileCommentsData }: { fileCommentsData: FilesCommentsType }) => {
  const { del } = useContext(DCContext);
  const { fileCommentId, fileId, content, authorName, authorProfilePhoto, role, roleId, authorId, date, liked, likes } =
    fileCommentsData;

  return (
    <div className={del ? styles.container__deleted : styles.container}>
      <div className={styles.comment}>
        <Avatar
          src={`${supabaseStorageProfileUrl}/${authorProfilePhoto}`}
          fallbackName={authorName}
          alt="author profile photo icon"
        />
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
        authorProfilePhoto={authorProfilePhoto}
        roleId={roleId!}
        comment={content}
        tableName="FilesComments">
        <SubComments fileCommentId={fileCommentId} fileId={fileId} />
      </OptionsComments>
    </div>
  );
};
