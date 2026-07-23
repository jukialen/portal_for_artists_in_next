'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { Avatar } from 'components/ui/atoms/Avatar/Avatar';

import { supabaseStorageProfileUrl } from 'constants/links';
import { CommentType } from 'types/global.types';

import { DCContext, DCProvider } from 'providers/DeleteCommentProvider';

import { SubComments } from 'components/functional/molecules/SubComments/SubComments';
import { OptionsComments } from 'components/functional/molecules/OptionsComments/OptionsComments';

import styles from './Comment.module.css';

export const Comment = ({ commentData }: { commentData: CommentType }) => {
  const { del } = useContext(DCContext);

  const { commentId, content, authorName, authorProfilePhoto, role, roleId, authorId, postId, date, liked, likes } =
    commentData;

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
            <Link href={`/user/${authorName}`} className={styles.pseudonym}>
              {authorName}
            </Link>
            <span className={styles.role}>{role}</span>
            <p className={styles.date}>{date}</p>
          </div>
          <h2 className={styles.text}>{content}</h2>
        </div>
      </div>
      <OptionsComments
        commentId={commentId}
        authorId={authorId}
        userId={authorId}
        tableName="Comments"
        fieldName="commentId"
        liked={liked}
        likes={likes}
        authorProfilePhoto={authorProfilePhoto}
        roleId={roleId!}
        comment={content}>
        <SubComments commentId={commentId} postId={postId} />
      </OptionsComments>
    </div>
  );
};
