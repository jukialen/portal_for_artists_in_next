import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { PostsType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { useDateData } from 'hooks/useDateData';
import { useHookSWR } from 'hooks/useHookSWR';

import { getDate } from 'helpers/getDate';

import { Post } from 'components/molecules/Post/Post';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Posts.module.scss';

type GroupsPropsType = { name: string; groupId: string };

export const Posts = ({ name, groupId }: GroupsPropsType) => {
  const [postsArray, setPostsArray] = useState<PostsType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const dataDateObject = useDateData();
  const data = useHookSWR();
  const maxItems = 30;

  const firstPosts = async () => {
    try {
      const postArray: PostsType[] = [];

      const posts: { data: PostsType[] } = await axios.get(`${backUrl}/posts/all`, {
        params: {
          queryData: {
            orderBy: { createdAt: 'desc' },
            where: { groupId },
            limit: maxItems,
          },
        },
      });

      for (const post of posts.data) {
        const {
          title,
          content,
          pseudonym,
          profilePhoto,
          likes,
          liked,
          shared,
          commented,
          groupId,
          authorId,
          postId,
          createdAt,
          updatedAt,
          roleId,
        } = post;

        postArray.push({
          title,
          content,
          pseudonym,
          profilePhoto,
          likes,
          liked,
          shared,
          commented,
          groupId,
          authorId,
          postId,
          date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
          name,
          roleId,
        });
      }

      setLastVisible(postArray[postArray.length - 1].postId!);
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
      const nextArray: PostsType[] = [];

      const posts: { data: PostsType[] } = await axios.get(`${backUrl}/posts/all`, {
        params: {
          queryData: {
            orderBy: 'createdAt, desc',
            where: { groupId },
            limit: maxItems,
            cursor: lastVisible,
          },
        },
      });

      for (const post of posts.data) {
        const {
          title,
          content,
          pseudonym,
          profilePhoto,
          likes,
          liked,
          shared,
          commented,
          groupId,
          authorId,
          postId,
          roleId,
          createdAt,
          updatedAt,
        } = post;

        nextArray.push({
          title,
          content,
          pseudonym,
          profilePhoto,
          likes,
          liked,
          shared,
          commented,
          groupId,
          authorId,
          postId,
          roleId,
          date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
          name,
        });
      }

      nextArray.length === maxItems && setLastVisible(nextArray[nextArray.length - 1].postId!);
      const newArray = postsArray.concat(nextArray);
      setI(++i);
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
              title,
              content,
              pseudonym,
              profilePhoto,
              likes,
              liked,
              shared,
              commented,
              groupId,
              authorId,
              postId,
              roleId,
              date,
            }: PostsType,
            index,
          ) => (
            <Post
              key={index}
              title={title}
              content={content}
              pseudonym={pseudonym}
              profilePhoto={profilePhoto}
              likes={likes}
              liked={liked}
              shared={shared}
              commented={commented}
              date={date}
              name={name}
              postId={postId}
              roleId={roleId}
              authorId={authorId}
              groupId={groupId}
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
