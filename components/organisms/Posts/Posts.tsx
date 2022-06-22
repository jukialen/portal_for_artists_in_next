import { useState } from 'react';
import { Avatar, Button, IconButton } from '@chakra-ui/react';

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { Comment } from 'components/atoms/Comment/Comment';
import { SharingButton } from 'components/atoms/SharingButton/SharingButton';

import styles from './Posts.module.scss';
import group from 'public/group.svg';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

export const Posts = () => {
  const [showComments, setShowComments] = useState(false);
  const [like, setLiked] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  
  const addLike = () => {
    setLikeCount(like ? likeCount-=1 : likeCount+=1)
    setLiked(!like);
  }
  
  const showingComments = () => setShowComments(!showComments);
  const linkToPost = 'test.com';
  
  return <section className={styles.posts}>
    <article className={styles.title}>
      <div className={styles.avatarWithUsername}>
        <Avatar src={group} />
        <div className={styles.username}><a>Nazwa użytkownika</a></div>
      </div>
      <div className={styles.titlePost}>
        Książki o rysowaniu
      </div>
      <div className={styles.time}>post time</div>
      <div className={styles.description}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
        a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
        Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </div>
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
        <SharingButton link={linkToPost} />
      </div>
      <p className={styles.likesCount} style={{marginLeft: likeCount < 10 ? '.8rem' : '.5rem'}}>
        {likeCount}
      </p>
      <article className={`${styles.commentsSection} ${showComments ? styles.showComments : ''}`}>
        <NewComments />
        <Comment />
        <Comment />
        <Comment />
      </article>
    </article>
  </section>;
};