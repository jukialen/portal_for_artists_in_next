import { useContext } from 'react';
import Link from 'next/link';
import { Avatar } from 'components/atoms/Avatar/Avatar';

import { CommentType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { SubComments } from 'components/molecules/SubComments/SubComments';
import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './Comment.module.scss';

export const Comment = ({
  commentId,
  content,
  authorName,
  authorProfilePhoto,
  role,
  roleId,
  authorId,
  postId,
  date,
  liked,
  likes,
}: CommentType) => {
  const { del } = useContext(DCContext);

  return (
    <div className={del ? styles.container__deleted : styles.container}>
      <div className={styles.comment}>
        <Avatar src={authorProfilePhoto} fallbackName={authorName} alt="author profile photo icon" />
        <div className={styles.rightSideComment}>
          <div className={styles.topPartComment}>
            <p className={styles.pseudonym}>
              <Link href={`/user/${authorName}`}>{authorName}</Link>
              <span>{role}</span>
            </p>
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
        liked={liked}
        likes={likes}>
        <NewComments
          profilePhoto={authorProfilePhoto}
          commentId={commentId}
          postId={postId}
          authorId={authorId}
          roleId={roleId!}
        />
        <SubComments commentId={commentId} postId={postId} />
      </OptionsComments>
    </div>
  );
};
