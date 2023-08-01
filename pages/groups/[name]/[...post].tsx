import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { PostType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { getDate } from 'helpers/getDate';

import { useDateData } from 'hooks/useDateData';

import { Post } from 'components/molecules/Post/Post';

export default function PostFromGroup() {
  const [postData, setPostData] = useState<PostType>();

  const { locale, asPath } = useRouter();

  const dataDateObject = useDateData();

  const split = asPath.split('/');
  const name = decodeURIComponent(split[2]);
  const pseudonym = decodeURIComponent(split[3]);
  const postId = decodeURIComponent(split[4]);

  const downloadPosts = async () => {
    try {
      const post: PostType = await axios.get(`${backUrl}/groups-posts/${postId}`);

      setPostData({
        title: post.title,
        content: post.content,
        commented: post.commented,
        pseudonym,
        profilePhoto: post.profilePhoto,
        likes: post.likes,
        liked: post.liked,
        shared: post.shared,
        groupId: post.groupId,
        authorId: post.authorId,
        role: post.role,
        date: getDate(locale!, post.updatedAt! || post.createdAt!, dataDateObject),
        groupsPostsId: post.groupsPostsId,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!(name && postId) && downloadPosts();
  }, [locale]);

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
    />
  );
}
