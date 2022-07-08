import { useEffect, useState } from 'react';
import { Avatar, Button, IconButton } from '@chakra-ui/react';

import { PostType } from 'types/global.types';

import { addingComment, comments, likePost} from 'references/referencesFirebase';

import { DeletePost } from 'components/atoms/DeletionPost/DeletionPost';
import { NewComments } from 'components/atoms/NewComments/NewComments';
import { SharingButton } from 'components/atoms/SharingButton/SharingButton';
import { Comments } from 'components/molecules/Comments/Comments';

import styles from './Post.module.scss';
import group from 'public/group.svg';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { arrayRemove, arrayUnion, setDoc } from 'firebase/firestore';

export const Post = ({ author, title, date, description, idPost, name, join, userId, currentUser, likes, liked }: PostType) => {
  const [showComments, setShowComments] = useState(false);
  const [like, setLike] = useState(false);
  let [likeCount, setLikeCount] = useState(likes || 0);
  
  const link = `${process.env.NEXT_PUBLIC_PAGE}/groups/${name}/${author}/${title}/${date}`;
  
  const showingComments = () => setShowComments(!showComments);
  
  const addLike = async () => {
    if (like) {
      await setDoc(likePost(name, idPost!),
        { likes: likeCount -= 1, liked: arrayRemove(userId) },
        { merge: true });
    } else {
      await setDoc(likePost(name, idPost!),
        { likes: likeCount += 1, liked: arrayUnion(userId) },
        { merge: true });
    };
    setLikeCount(like ? likeCount -= 1 : likeCount += 1);
    setLike(!like);
  };
  
  const likedCount = () => {
    try {
      liked?.forEach(like => like === userId ? setLike(true) : setLike(false))
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    likedCount();
  }, []);
  
  
  return <article className={styles.container}>
    <div className={styles.avatarWithUsername}>
      <Avatar src={group} />
      <div className={styles.username}>
        <a href={`/user/${author}`}>{author}</a>
      </div>
      {currentUser === userId && <DeletePost name={name} idPost={idPost!} />}
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
      <SharingButton link={link} />
    </div>
    <p className={styles.likesCount} style={{ marginLeft: likeCount < 10 ? '.8rem' : '.5rem' }}>
      {likeCount}
    </p>
    <article className={`${styles.commentsSection} ${showComments ? styles.showComments : ''}`}>
      {join && currentUser === userId && <NewComments name={name} refCom={addingComment(name, idPost!)} />}
      {/*// @ts-ignore*/}
      <Comments name={name} refCom={comments(name!)} />
    </article>
  </article>
}
