import { useContext } from 'react';
import { Avatar } from '@chakra-ui/react';

import { CommentType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './Comment.module.scss';

export const Comment = ({
  author,
  date,
  comment,
  profilePhoto,
  postId,
  commentId,
  userId,
  likes,
  liked,
  authorId,
  groupSource,
  name,
}: CommentType) => {
  const { del } = useContext(DCContext);

  return (
    <div className={del ? styles.container__deleted : styles.container}>
      <div className={styles.comment}>
        <Avatar src={profilePhoto} className={styles.avatar} />
        <div className={styles.rightSideComment}>
          <div className={styles.topPartComment}>
            <p className={styles.pseudonym}>
              <a href={`/user/${author}`}>{author}</a>
            </p>
            <p className={styles.date}>{date}</p>
          </div>
          <h2 className={styles.text}>{comment}</h2>
        </div>
      </div>
      <OptionsComments
        userId={userId}
        postId={postId}
        commentId={commentId}
        authorId={authorId}
        likes={likes}
        liked={liked}
        groupSource={groupSource}
        name={name}
      />
    </div>
  );
};
