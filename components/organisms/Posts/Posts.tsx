import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, getDocs } from 'firebase/firestore';

import { posts, user } from 'config/referencesFirebase';

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
            pseudonym: docSnap.data().pseudonym,
            title: query.data().title,
            date: getDate(locale!, query.data().date),
            content: query.data().message,
            idPost: query.id,
            nameGroup: query.data().nameGroup,
            userId: query.data().author,
            likes: query.data().likes,
            liked: query.data().liked,
            profilePhoto: docSnap.data().profilePhoto,
          });
        }
      }
      setPostsArray(postArray);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!nameGroup && downloadPosts();
  }, [nameGroup, locale]);

  return (
    <section className={styles.posts}>
      {postsArray.length > 0 ? (
        postsArray.map(
          (
            {
              pseudonym: author,
              title,
              date,
              content: description,
              idPost,
              nameGroup,
              userId,
              likes,
              liked,
              profilePhoto: logoUser,
            }: PostType,
            index,
          ) => (
            <Post
              key={index}
              pseudonym={author}
              title={title}
              date={date}
              content={description}
              nameGroup={nameGroup}
              idPost={idPost}
              authorId={currentUser}
              userId={userId}
              likes={likes}
              liked={liked}
              profilePhoto={logoUser}
            />
          ),
        )
      ) : (
        <p className={styles.noPosts}>{data?.Posts.noPosts}</p>
      )}
    </section>
  );
};
