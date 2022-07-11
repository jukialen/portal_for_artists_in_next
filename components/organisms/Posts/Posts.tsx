import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../firebase';
import { doc, getDoc, getDocs, Timestamp } from 'firebase/firestore';

import { posts } from 'references/referencesFirebase';

import { AuthorType, PostType } from 'types/global.types';

import { Post } from 'components/atoms/Post/Post';

import styles from './Posts.module.scss';

export const Posts = ({ name, join, currentUser }: AuthorType) => {
  const [postsArray, setPostsArray] = useState<PostType[]>([]);
  
  const { locale } = useRouter();
  
  const getDate = (dateField: Timestamp) => {
    const today = new Date();
  
    const hour = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCHours();
    const minutes = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCMinutes();
    const day = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCDay()
    const month = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCMonth() + 1;
    const year = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCFullYear();
    
    const jpHours = `${hour >= 12 ? '午後' : '午前'}${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`
    const jpDate = `${year !== today.getUTCFullYear() ? year : ''}${year !== today.getUTCFullYear() ? '年' : ''}${month < 10 ? '0' : ''}${month}月${day}日`
    
    const hours = `${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
    const date = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}${year !== today.getUTCFullYear() ? '/' : ''}${year !== today.getUTCFullYear() ? year : ''}`;
   
    return locale === 'jp' ? `${jpHours} ${jpDate}` : `${date} ${hours}`;
  };
  
  const downloadPosts = async () => {
    try {
      const postArray: PostType[] = [];
      const querySnapshot = await getDocs(posts(name!));
      querySnapshot.forEach(async (document) => {
        const docRef = doc(db, `users/${document.data().author}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          postArray.push({
            author: docSnap.data().pseudonym,
            title: document.data().title,
            date: getDate(document.data().date),
            description: document.data().message,
            idPost: document.id,
            name: document.data().nameGroup,
            userId: document.data().author,
            likes: document.data().likes,
            liked: document.data().liked
          });
        }
      });
      setPostsArray(postArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!name && downloadPosts();
  }, [name, locale]);
  
  return <section className={styles.posts}>
    {postsArray.length > 0 ? postsArray.map(({ author, title, date, description, idPost, name, userId, likes, liked }: PostType) =>
      <Post
        key={idPost}
        author={author}
        title={title}
        date={date}
        description={description}
        name={name}
        idPost={idPost}
        join={join}
        currentUser={currentUser}
        userId={userId}
        likes={likes}
        liked={liked}
      />
    ) : <p>Brak postów</p>}
  </section>;
};