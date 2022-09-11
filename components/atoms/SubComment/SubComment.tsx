import { useContext } from 'react';
import { Avatar } from '@chakra-ui/react';

import { CommentType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

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
  refSubCom,
  refDocSubCom,
  refLastCom
}: CommentType) => {
  const { del } = useContext(DCContext);
  
  return <div className={del ? styles.container__deleted : styles.container}>
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
      refSubCom={refSubCom}
      refLastCom={refLastCom!}
      refDelCom={refDocSubCom!}
      refDocSubCom={refDocSubCom!}
    />
  </div>
}