'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { LangType, PostsType } from 'types/global.types';
import { Database } from 'types/database.types';
import { useScopedI18n } from 'locales/client';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';

import { Post } from 'components/molecules/Post/Post';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Posts.module.scss';

type GroupsPropsType = {
  groupId: string;
  locale: LangType;
  userId: string;
  profilePhoto: string;
  name: string;
  firstPosts: PostsType[] | undefined;
};

export const Posts = ({ groupId, locale, userId, profilePhoto, name, firstPosts }: GroupsPropsType) => {
  const [postsArray, setPostsArray] = useState<PostsType[] | undefined>(firstPosts);
  const [lastVisible, setLastVisible] = useState(
    !!firstPosts && firstPosts?.length > 0 ? firstPosts[firstPosts?.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);

  const dataDateObject = dateData();
  const tPosts = useScopedI18n('Posts');
  const maxItems = 30;
  const supabase = createClientComponentClient<Database>();

  const nextPosts = async () => {
    let nextArray: PostsType[] = [];

    const { data } = await supabase
      .from('Posts')
      .select('*, Users (pseudonym, profilePhoto), Roles (id)')
      .eq('groupId', groupId)
      .order('createdAt', { ascending: false })
      .gt('createdAt', lastVisible)
      .limit(maxItems);

    for (const post of data!) {
      const { title, content, shared, commented, authorId, groupId, postId, createdAt, updatedAt, Users, Roles } = post;

      const { data: lData, count } = await supabase.from('Liked').select('id, userId').match({ postId, authorId });

      const indexCurrentUser = lData?.findIndex((v) => v.userId === authorId) || -1;

      nextArray.push({
        authorName: Users?.pseudonym!,
        authorProfilePhoto: Users?.profilePhoto!,
        liked: indexCurrentUser >= 0,
        postId,
        title,
        content,
        likes: count || 0,
        shared,
        commented,
        authorId,
        groupId,
        roleId: Roles?.id!,
        date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
        idLiked: !!lData && lData?.length > 0 ? lData[indexCurrentUser].id : '',
      });
    }

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
