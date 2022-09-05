import { Avatar } from '@chakra-ui/react';

import { CommentType } from 'types/global.types';

import styles from './Comment.module.scss';

export const Comment = ({ author, date, description, profilePhoto  }: CommentType) => {
  return <div className={styles.comment}>
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
};