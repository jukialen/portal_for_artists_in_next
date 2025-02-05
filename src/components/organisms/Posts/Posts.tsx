'use client';

import { useState } from 'react';

import { PostsType } from 'types/global.types';
import { useScopedI18n } from 'locales/client';

import { Post } from 'components/molecules/Post/Post';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Posts.module.scss';
import { againPosts } from '../../../utils/posts';

type GroupsPropsType = {
  groupId: string;
  userId: string;
  profilePhoto: string;
  name: string;
  firstPosts: PostsType[] | undefined;
};

export const Posts = ({ groupId, userId, profilePhoto, name, firstPosts }: GroupsPropsType) => {
  const [postsArray, setPostsArray] = useState<PostsType[] | undefined>(firstPosts);
  const [lastVisible, setLastVisible] = useState(
    !!firstPosts && firstPosts?.length > 0 ? firstPosts[firstPosts?.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);

  const tPosts = useScopedI18n('Posts');
  const maxItems = 30;

  const nextPosts = async () => {
    const nextArray: PostsType[] = (await againPosts(groupId, lastVisible!, maxItems))!;

    nextArray.length === maxItems && setLastVisible(nextArray[nextArray.length - 1].createdAt!);
    const newArray = postsArray?.concat(nextArray);
    setI(++i);
    setPostsArray(newArray);
  };

  return (
    <section className={styles.posts}>
      {!!postsArray && postsArray?.length > 0 ? (
        postsArray?.map((post: PostsType, index) => (
          <Post key={index} userId={userId} profilePhoto={profilePhoto} name={name} postOnGroup={post!} />
        ))
      ) : (
        <p className={styles.noPosts}>{tPosts('noPosts')}</p>
      )}

      {!!lastVisible && !!postsArray && postsArray.length === maxItems * i && <MoreButton nextElements={nextPosts} />}
    </section>
  );
};
