'use client';

import { useState } from 'react';

import { cloudFrontUrl } from 'constants/links';
import { LangType, PostsType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';

import { Post } from 'components/molecules/Post/Post';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Posts.module.scss';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type GroupsPropsType = { groupId: string; locale: LangType; userId: string; pseudonym: string };

export const Posts = ({ groupId, locale, userId, pseudonym }: GroupsPropsType) => {
  const [postsArray, setPostsArray] = useState<PostsType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const dataDateObject = dateData();

  const maxItems = 30;

  const supabase = createClientComponentClient();
  const nextPosts = async (locale: LangType, groupId: string) => {
    let nextArray: PostsType[] = [];

    const { data } = await supabase
      .from('Posts')
      .select('*, Users (pseudonym, profilePhoto), Roles (id)')
      .eq('groupId', groupId)
      .order('createdAt', { ascending: false })
      .lt('createdAt', lastVisible)
      .limit(maxItems);

    for (const post of data!) {
      const { title, content, likes, shared, commented, authorId, groupId, createdAt, updatedAt, Users, Roles } = post;

      const { data } = await supabase.from('Liked').select('id').match({ postId: postId, userId: authorId }).single();

      postsArray.push({
        authorName: Users?.pseudonym!,
        authorProfilePhoto: `https://${cloudFrontUrl}/${Users?.profilePhoto!}`,
        liked: !!data?.id,
        postId,
        title,
        content,
        likes,
        shared,
        commented,
        authorId,
        groupId,
        roleId: Roles?.id!,
        date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
      });
    }
    nextArray.length === maxItems && setLastVisible(nextArray[nextArray.length - 1].createdAt!);
    const newArray = postsArray.concat(nextArray);
    setI(++i);
    setPostsArray(newArray);
  };

  return (
    <section className={styles.posts}>
      {postsArray.length > 0 ? (
        postsArray.map((post: PostsType, index) => (
          <Post key={index} userId={userId} pseudonym={pseudonym} postOnGroup={post!} />
        ))
      ) : (
        <p className={styles.noPosts}>{language?.Posts.noPosts}</p>
      )}

      {!!lastVisible && postsArray.length === maxItems * i && (
        <MoreButton nextElements={() => nextPosts(locale, groupId)} />
      )}
    </section>
  );
};
