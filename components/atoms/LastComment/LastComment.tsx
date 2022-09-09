import { Avatar } from '@chakra-ui/react';

import { CommentType } from 'types/global.types';

import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './LastComment.module.scss';

export const LastComment = ({
  author,
  date,
  description,
  profilePhoto,
  userId,
  subCollection,
  idPost,
  idComment,
  authorId,
  likes,
  liked,
  refDocLastCom
}: CommentType) => {
  return <div className={styles.container}>
    <div className={styles.comment}>
      <Avatar src={profilePhoto} className={styles.avatar} />
      <div className={styles.rightSideComment}>
        <div className={styles.topPartComment}>
          <p className={styles.pseudonym}>
            <a href={`/user/${author}`}>{author}</a>
          </p>
          <p className={styles.date}>{date}</p>
        </div>
        <h2 className={styles.text}>{description}</h2>
      </div>
    </div>

    <OptionsComments
      userId={userId}
      subCollection={subCollection}
      idPost={idPost}
      idComment={idComment}
      authorId={authorId}
      likes={likes}
      liked={liked}
      refDelCom={refDocLastCom!}
      refDocLastCom={refDocLastCom!}
    />
  </div>
};