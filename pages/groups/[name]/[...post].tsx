import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';
import { arrayRemove, arrayUnion, getDocs, setDoc } from 'firebase/firestore';

import { AuthorType } from 'types/global.types';

import { addingComment, comments, deleteUserFromGroup, likePost, posts } from 'references/referencesFirebase';

import { DeletePost } from 'components/atoms/DeletionPost/DeletionPost';
import { SharingButton } from 'components/atoms/SharingButton/SharingButton';
import { NewComments } from 'components/atoms/NewComments/NewComments';
import { Comments } from 'components/molecules/Comments/Comments';

import styles from './index.module.scss';
import { Avatar, Button, IconButton } from '@chakra-ui/react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import group from 'public/group.svg';

export default function PostFromGroup() {
  const [join, setJoin] = useState(false);
  const [like, setLike] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [userId, setUserId] = useState('');
  const [description, setDescription] = useState('');
  const [idPost, setIdPost] = useState('');
  
  const { asPath } = useRouter();
  
  const currentUser = auth.currentUser?.uid;
  const split = asPath.split('/');
  // @ts-ignore
  const name: AuthorType = decodeURIComponent(split[2]);
  const author = decodeURIComponent(split[3]);
  const title = split[4];
  const date = split[5];
  
  const link = `${process.env.NEXT_PUBLIC_PAGE}/groups/${name}/${author}/${title}/${date}`;
  
  const joining = async () => {
    try {
      // @ts-ignore
      const querySnapshot = await getDocs(deleteUserFromGroup(name, currentUser));
      querySnapshot.forEach((doc) => {
        doc.data().username === currentUser && setJoin(true);
      });
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    name && joining();
  }, [name]);
  
  const downloadPosts = async () => {
    try {
      const querySnapshot = await getDocs(posts(name!));
      querySnapshot.forEach((document) => {
        setDescription(document.data().message);
        setIdPost(document.id);
        setUserId(document.data().author);
        setLikeCount(document.data().likes);
        setLike(document.data().liked);
      });
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!name && downloadPosts();
  }, [name]);
  
  const addLike = async () => {
    if (like) {
      await setDoc(likePost(name, idPost!),
        { likes: likeCount -= 1, liked: arrayRemove(currentUser) },
        { merge: true });
    } else {
      await setDoc(likePost(name, idPost!),
        { likes: likeCount += 1, liked: arrayUnion(currentUser) },
        { merge: true });
    }
    setLikeCount(like ? likeCount -= 1 : likeCount += 1);
    setLike(!like);
  };
  
  const showingComments = () => setShowComments(!showComments);
  
  return <article className={styles.container}>
    <div className={styles.avatarWithUsername}>
      <Avatar src={group} />
      <div className={styles.username}>
        <a href={`/user/${author}`}>{author}</a>
      </div>
      {/*// @ts-ignore*/}
      {currentUser == userId && <DeletePost name={name!} idPost={idPost!} />}
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
      {join && currentUser === userId && <NewComments name={name!} refCom={addingComment(name!, idPost!)} />}
      {/*// @ts-ignore*/}
      <Comments name={name} refCom={comments(name)} />
    </article>
  </article>;
}