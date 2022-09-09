import { Avatar } from '@chakra-ui/react';

import { CommentType } from 'types/global.types';

import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './SubComment.module.scss';

export const SubComment = ({
  author,
  date,
  description,
  profilePhoto,
  userId,
  subCollection,
  authorId,
  idPost,
  idComment,
  idSubComment,
  likes,
  liked,
  refDocSubCom,
  refLastCom
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
      idSubComment={idSubComment}
      authorId={authorId}
      likes={likes}
      liked={liked}
      refLastCom={refLastCom!}
      refDelCom={refDocSubCom!}
      refDocSubCom={refDocSubCom!}
    />
  </div>
}