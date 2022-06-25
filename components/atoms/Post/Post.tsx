import { useState } from 'react';
import { Avatar, Button, IconButton } from '@chakra-ui/react';

import { PostType } from 'types/global.types';

import { SharingButton } from 'components/atoms/SharingButton/SharingButton';
import { Comment } from 'components/atoms/Comment/Comment';
import { NewComments } from 'components/atoms/NewComments/NewComments';

import styles from './Post.module.scss';
import group from 'public/group.svg';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';


export const Post = ({author, title, date, description, idPost, name}: PostType) => {
  const [showComments, setShowComments] = useState(false);
  const [like, setLiked] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  
  const addLike = () => {
    setLikeCount(like ? likeCount -= 1 : likeCount += 1);
    setLiked(!like);
  };
  
  const showingComments = () => setShowComments(!showComments);
  
  return <article
    className={styles.container}
  >
    <div className={styles.avatarWithUsername}>
      <Avatar src={group} />
      <div className={styles.username}>
        <a>{author}</a>
      </div>
    </div>
    <div className={styles.titlePost}>{title}</div>
    <div className={styles.time}>{date}</div>
    <div className={styles.description}>{description}</div>
    <div className={styles.options}>
      <IconButton
        aria-label={like ? 'liked' : 'to like'}
        colorScheme='teal'
        icon={like ? <AiFillLike size='sm' /> : <AiOutlineLike size='sm' />}
        className={styles.likes}
        onClick={addLike}
      />
      <Button
        colorScheme='blue'
        onClick={showingComments}
        className={styles.commentsButton}
        variant='ghost'
      >Comments</Button>
      <SharingButton link={`/post/${author}/${title}/${date}`} />
    </div>
    <p className={styles.likesCount} style={{ marginLeft: likeCount < 10 ? '.8rem' : '.5rem' }}>
      {likeCount}
    </p>
    <article className={`${styles.commentsSection} ${showComments ? styles.showComments : ''}`}>
      {console.log(idPost)}
      <NewComments name={name} idPost={idPost!} />
      <Comment />
      <Comment />
      <Comment />
    </article>
  </article>
}
