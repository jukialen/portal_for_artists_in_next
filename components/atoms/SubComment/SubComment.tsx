import { useContext } from 'react';
import { Avatar } from '@chakra-ui/react';

import { CommentType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './SubComment.module.scss';

export const SubComment = ({
  author,
  date,
  name,
  profilePhoto,
  authorId,
  postId,
  commentId,
  comment,
  subCommentId,
  likes,
  liked,
}: CommentType) => {
  const { del } = useContext(DCContext);

  return (
    <div className={del ? styles.container__deleted : styles.container}>
      <div className={styles.comment}>
        <Avatar src={profilePhoto} className={styles.avatar} />
        <div className={styles.rightSideComment}>
          <div className={styles.topPartComment}>
            <p className={styles.pseudonym}>
              <Link href={`/user/${author}`}>{author}</Link>
            </p>
            <p className={styles.date}>{date}</p>
          </div>
          <h2 className={styles.text}>{comment}</h2>
        </div>
      </div>

      <OptionsComments
//        userId={userId}
        postId={postId}
        commentId={commentId}
//        subCommentId={subCommentId}
        authorId={authorId}
//        likes={likes}
//        liked={liked}
        name={name}
      />
    </div>
  );
};
