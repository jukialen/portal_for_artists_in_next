'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from 'components/ui/atoms/Avatar/Avatar';

import { supabaseStorageProfileUrl } from 'constants/links';
import { selectCommentsData } from 'constants/values';
import { CommentType } from 'types/global.types';

import { OptionsComments } from 'components/functional/molecules/OptionsComments/OptionsComments';
import { Tag } from 'components/ui/atoms/Tag/Tag';

import styles from './Comment.module.css';

export const Comment = ({ commentData }: { commentData: CommentType }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [currentContent, setCurrentContent] = useState(commentData.content);

  if (isDeleted) return null;

  const {
    fileId,
    commentId,
    fileCommentId,
    authorName,
    authorProfilePhoto,
    role,
    roleId,
    authorId,
    postId,
    subCommentId,
    lastCommentId,
    date,
    liked,
    likes,
  } = commentData;

  const { tableName, columnIdName } = selectCommentsData(
    postId,
    fileId,
    commentId,
    fileCommentId,
    subCommentId,
    lastCommentId,
  );

  return (
    <div className={styles.container}>
      <div className={styles.comment}>
        <Avatar
          src={`${supabaseStorageProfileUrl}/${authorProfilePhoto}`}
          fallbackName={authorName}
          alt="author profile photo icon"
        />
        <div className={styles.rightSideComment}>
          <div className={role === 'AUTHOR' ? styles.authorTopPartComment : styles.topPartComment}>
            <Link href={`/user/${authorName}`} className={styles.pseudonym}>
              {authorName}
            </Link>
            {role === 'AUTHOR' && <Tag value={role} />}
            <p className={styles.date}>{date}</p>
          </div>
          <p className={styles.text}>{currentContent}</p>
        </div>
      </div>
      <OptionsComments
        commentId={commentId}
        fileCommentId={fileCommentId}
        subCommentId={subCommentId}
        lastCommentId={lastCommentId}
        authorId={authorId}
        userId={authorId}
        tableName={tableName}
        fieldName={columnIdName}
        liked={liked}
        likes={likes}
        authorProfilePhoto={authorProfilePhoto}
        roleId={roleId!}
        comment={currentContent}
        onDeleteSuccessAction={() => setIsDeleted(true)}
        onUpdateSuccessAction={(newText) => setCurrentContent(newText)}
      />
    </div>
  );
};
