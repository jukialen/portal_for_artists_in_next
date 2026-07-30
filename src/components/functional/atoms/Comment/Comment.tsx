'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Avatar } from 'components/ui/atoms/Avatar/Avatar';

import { supabaseStorageProfileUrl } from 'constants/links';
import { CommentType } from 'types/global.types';

const Comments = dynamic(() => import('components/functional/molecules/Comments/Comments').then((mod) => mod.Comments));
import { OptionsComments } from 'components/functional/molecules/OptionsComments/OptionsComments';
import { Tag } from 'components/ui/atoms/Tag/Tag';

import styles from './Comment.module.css';

type CommentProps = {
  commentData: CommentType;
  onReplyAdded?: (newComment: CommentType) => void;
};

export const Comment = ({ commentData, onReplyAdded }: CommentProps) => {
  const [del, setDel] = useState(false);

  const changeDel = () => setDel(!del);

  const {
    commentId,
    fileCommentId,
    content,
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
            <Tag value={role} />
            <p className={styles.date}>{date}</p>
          </div>
          <h2 className={styles.text}>{content}</h2>
        </div>
      </div>
      <OptionsComments
        commentId={commentId}
        fileCommentId={fileCommentId}
        subCommentId={subCommentId}
        lastCommentId={lastCommentId}
        authorId={authorId}
        userId={authorId}
        tableName="Comments"
        fieldName="commentId"
        liked={liked}
        likes={likes}
        authorProfilePhoto={authorProfilePhoto}
        roleId={roleId!}
        comment={content}
        onReplyAdded={onReplyAdded}>
        <Comments
          commentId={commentId}
          fileCommentId={fileCommentId}
          subCommentId={subCommentId}
          lastCommentId={lastCommentId}
          postId={postId}
        />
      </OptionsComments>
    </div>
  );
};
