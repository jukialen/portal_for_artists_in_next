import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, getDocs } from 'firebase/firestore';

import { posts, user } from 'references/referencesFirebase';

import { AuthorType, PostType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { Post } from 'components/molecules/Post/Post';

import styles from './Posts.module.scss';

export const Posts = ({ name, currentUser }: AuthorType) => {
  const [postsArray, setPostsArray] = useState<PostType[]>([]);
  
  const { locale } = useRouter();
  
  const downloadPosts = async () => {
    try {
      const postArray: PostType[] = [];
      const querySnapshot = await getDocs(posts(name!));
      
      querySnapshot.forEach(async (document) => {
        const docSnap = await getDoc(user(document.data().author));
        if (docSnap.exists()) {
          postArray.push({
            author: docSnap.data().pseudonym,
            title: document.data().title,
            date: getDate(locale!, document.data().date),
            description: document.data().message,
            idPost: document.id,
            name: document.data().nameGroup,
            userId: document.data().author,
            likes: document.data().likes,
            liked: document.data().liked,
            logoUser: docSnap.data().profilePhoto
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
    {postsArray.length > 0 ? postsArray.map(({ author, title, date, description, idPost, name, userId, likes, liked, logoUser }: PostType) =>
      <Post
        key={idPost}
        author={author}
        title={title}
        date={date}
        description={description}
        name={name}
        idPost={idPost}
        currentUser={currentUser}
        userId={userId}
        likes={likes}
        liked={liked}
        logoUser={logoUser}
      />
    ) : <p>Brak postów</p>}
  </section>;
};