import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, getDocs } from 'firebase/firestore';

import { posts, user } from 'references/referencesFirebase';

import { AuthorType, PostType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { getDate } from 'helpers/getDate';

import { Post } from 'components/molecules/Post/Post';

import styles from './Posts.module.scss';

export const Posts = ({ nameGroup, currentUser }: AuthorType) => {
  const [postsArray, setPostsArray] = useState<PostType[]>([]);
  
  const { locale } = useRouter();
  const data = useHookSWR();
  
  const downloadPosts = async () => {
    try {
      const postArray: PostType[] = [];
      const querySnapshot = await getDocs(posts(nameGroup!));
      
      for (const query of querySnapshot.docs) {
        const docSnap = await getDoc(user(query.data().author));
        
        if (docSnap.exists()) {
          postArray.push({
            author: docSnap.data().pseudonym,
            title: query.data().title,
            date: getDate(locale!, query.data().date),
            description: query.data().message,
            idPost: query.id,
            nameGroup: query.data().nameGroup,
            userId: query.data().author,
            likes: query.data().likes,
            liked: query.data().liked,
            logoUser: docSnap.data().profilePhoto
          });
        }
      };

      setPostsArray(postArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!nameGroup && downloadPosts();
  }, [nameGroup, locale]);
  
  return <section className={styles.posts}>
    {postsArray.length > 0 ? postsArray.map(({ author, title, date, description, idPost, nameGroup, userId, likes, liked, logoUser }: PostType, index) =>
      <Post
        key={index}
        author={author}
        title={title}
        date={date}
        description={description}
        nameGroup={nameGroup}
        idPost={idPost}
        currentUser={currentUser}
        userId={userId}
        likes={likes}
        liked={liked}
        logoUser={logoUser}
      />
    ) : <p className={styles.noPosts}>{data?.Posts.noPosts}</p>}
  </section>;
};