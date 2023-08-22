import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import url from 'url';

import { PostType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { useDateData } from 'hooks/useDateData';
import { useHookSWR } from 'hooks/useHookSWR';

import { getDate } from 'helpers/getDate';

import { Post } from 'components/molecules/Post/Post';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Posts.module.scss';

type GroupsPropsType = { name: string; groupId: string };

export const Posts = ({ name, groupId }: GroupsPropsType) => {
  const [postsArray, setPostsArray] = useState<PostType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const dataDateObject = useDateData();
  const data = useHookSWR();
  const maxItems = 30;

  const firstPosts = async () => {
    const queryParams = {
      orderBy: 'createdAt, desc',
      where: groupId,
      limit: maxItems.toString(),
    };

    const params = new url.URLSearchParams(queryParams);

    try {
      const postArray: PostType[] = [];

      const posts: PostType[] = await axios.get(`${backUrl}/posts/all?${params}`);

      for (const post of posts) {
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
    const queryParamsWithCursor = {
      orderBy: 'createdAt, desc',
      where: groupId,
      limit: maxItems.toString(),
      cursor: lastVisible,
    };
    const paramsWithCursor = new url.URLSearchParams(queryParamsWithCursor);

    try {
      const nextArray: PostType[] = [];

      const posts: PostType[] = await axios.get(`${backUrl}/posts/all?${paramsWithCursor}`);

      for (const post of posts) {
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
              date,
            }: PostType,
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
