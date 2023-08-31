import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { PostsType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { getDate } from 'helpers/getDate';

import { useDateData } from 'hooks/useDateData';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { Post } from 'components/molecules/Post/Post';

export default function PostFromGroup() {
  const [postData, setPostData] = useState<PostsType>();

  const { locale, asPath } = useRouter();

  const dataDateObject = useDateData();

  const split = asPath.split('/');
  const containUrl = split.includes('https') || split.includes('http');

  const name = decodeURIComponent(split[containUrl ? 4 : 2]);
  //  const pseudonym = decodeURIComponent(split[containUrl ? 5 : 3]);
  const postId = decodeURIComponent(split[containUrl ? 6 : 4]);

  const downloadPosts = async () => {
    try {
      const post: PostsType = await axios.get(`${backUrl}/posts/${postId}`);

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
        createdAt,
        updatedAt,
        roleId,
      } = post;

      setPostData({
        title,
        content,
        likes,
        liked,
        shared,
        commented,
        groupId,
        profilePhoto,
        pseudonym,
        authorId,
        name,
        roleId,
        date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!(name && postId) && downloadPosts();
  }, [locale, name, postId]);

  if (useCurrentUser('/signin')) {
    return null;
  }

  return (
    <Post
      pseudonym={pseudonym}
      title={postData!.title}
      date={postData!.date}
      content={postData!.content}
      name={name}
      postId={postId}
      authorId={postData!.authorId}
      likes={postData!.likes}
      liked={postData!.liked}
      commented={postData!.commented}
      shared={postData!.shared}
      profilePhoto={postData?.profilePhoto}
      groupId={postData!.groupId}
      roleId={postData!.roleId}
    />
  );
}
