import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, getDocs } from 'firebase/firestore';

import { posts } from 'references/referencesFirebase';

import { AuthorType, PostType } from 'types/global.types';

import { Post } from 'components/atoms/Post/Post';

import styles from './Posts.module.scss';

export const Posts = ({ name }: AuthorType) => {
  const [postsArray, setPostsArray] = useState<PostType[]>([]);
  
  const downloadPosts = async () => {
    try {
      const postArray: PostType[] = [];
      // @ts-ignore
      const querySnapshot = await getDocs(posts(name!));
      querySnapshot.forEach(async (document) => {
        const docRef = doc(db, `users/${document.data().author}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          postArray.push({
            author: docSnap.data().pseudonym,
            title: document.data().title,
            date: `${new Date(document.data().date.nanoseconds).getDay()}.${new Date(document.data().date.nanoseconds).getMonth() + 1}.${new Date(document.data().date.nanoseconds).getFullYear()}`,
            description: document.data().message,
            idPost: document.id,
            name: document.data().nameGroup
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
  }, [name, posts]);
  
  return <section className={styles.posts}>
    {postsArray.length > 0 ? postsArray.map(({ author, title, date, description, idPost, name }: PostType) =>
      <Post key={idPost} author={author} title={title} date={date} description={description} name={name} idPost={idPost} />
    ) : <p>Brak postów</p>}
  </section>;
};