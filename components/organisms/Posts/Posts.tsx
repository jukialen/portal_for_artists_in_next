import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { PostType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { useHookSWR } from 'hooks/useHookSWR';

import { getDate } from 'helpers/getDate';

import { Post } from 'components/molecules/Post/Post';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Posts.module.scss';

type GroupsPropsType = {
  name: string;
  groupId: string;
};

export const Posts = ({ name, groupId }: GroupsPropsType) => {
  const [postsArray, setPostsArray] = useState<PostType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const data = useHookSWR();
  const maxItems = 30;

  const firstPosts = async () => {
    try {
      const postArray: PostType[] = [];

      const posts: PostType[] = await axios.get(`${backUrl}/posts`, {
        params: {
          where: { groupId },
          orderBy: 'createdAt',
          limit: maxItems,
        },
      });

      for (const post of posts) {
        postArray.push({
          groupsPostsId: post.groupsPostsId,
          postId: post.postId!,
          groupId: post.groupId,
          title: post.title,
          content: post.content,
          likes: post.likes,
          liked: post.liked,
          date: getDate(locale!, post.updatedAt || post.createdAt),
          name,
          pseudonym: post.pseudonym,
          authorId: post.authorId,
          profilePhoto: post.profilePhoto,
        });
      }

      setLastVisible(postArray[postArray.length - 1].postId);
      setPostsArray(postArray);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!name && firstPosts();
  }, [name, locale]);

  const nextPosts = async () => {
    try {
      const nextArray: PostType[] = [];

      const posts: PostType[] = await axios.get(`${backUrl}/groups-posts`, {
        params: {
          where: { groupId },
          orderBy: 'createdAt',
          limit: maxItems,
          cursor: lastVisible,
        },
      });
      for (const post of posts) {
        nextArray.push({
          groupsPostsId: post.groupsPostsId,
          postId: post.postId!,
          groupId: post.groupId,
          title: post.title,
          content: post.content,
          likes: post.likes,
          liked: post.liked,
          date: getDate(locale!, post.updatedAt || post.createdAt),
          name,
          pseudonym: post.pseudonym,
          authorId: post.authorId,
          profilePhoto: post.profilePhoto,
        });
      }

      nextArray.length === maxItems && setLastVisible(nextArray[nextArray.length - 1].postId);
      setI(++i);
      const newArray = postsArray.concat(nextArray);
      setPostsArray(newArray);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className={styles.posts}>
      {postsArray.length > 0 ? (
        postsArray.map(
          (
            {
              pseudonym,
              title,
              date,
              content: description,
              postId,
              name,
              authorId,
              likes,
              liked,
              profilePhoto,
            }: PostType,
            index,
          ) => (
            <Post
              key={index}
              pseudonym={pseudonym}
              title={title}
              date={date}
              content={description}
              name={name}
              postId={postId}
              authorId={authorId}
              likes={likes}
              liked={liked}
              profilePhoto={profilePhoto}
            />
          ),
        )
      ) : (
        <p className={styles.noPosts}>{data?.Posts.noPosts}</p>
      )}

      {!!lastVisible && postsArray.length === maxItems * i && <MoreButton nextElements={nextPosts} />}
    </section>
  );
};
