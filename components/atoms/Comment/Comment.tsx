import { Avatar } from '@chakra-ui/react';

import { CommentType } from 'types/global.types';

import styles from './Comment.module.scss';
import group from 'public/group.svg';

export const Comment = ({ idPost, author, date, description  }: CommentType) => {
  
  return <div className={styles.comment} key={idPost}>
    <Avatar src={group} className={styles.avatar} />
    <div className={styles.rightSideComment}>
      <div className={styles.topPartComment}>
        <p className={styles.pseudonym}>
          <a href={`/user/${author}`}>{author || 'user'}</a>
        </p>
        <p className={styles.date}>{date}</p>
      </div>
      <h2 className={styles.text}>{description}</h2>
    </div>
  </div>
};