'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { PostsType } from 'types/global.types';
import { backUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { Post } from 'components/molecules/Post/Post';

type DataDateType = { second: string; minute: string; hour: string; day: string; yearDateSeparator: string };
type PostWrapperType = { locale: string; name: string; postId: string; dataDateObject: DataDateType };
export const PostWrapper = ({ locale, name, postId, dataDateObject }: PostWrapperType) => {
  const [postData, setPostData] = useState<PostsType>();

  const downloadPosts = async () => {
    try {
      const post: { data: PostsType } = await axios.get(`${backUrl}/posts/${postId}`);

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
      } = post.data;

      setPostData({
        title,
        content,
        likes,
        liked,
        shared,
        commented,
        groupId,
        pseudonym,
        profilePhoto,
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

  return (
    <Post
      pseudonym={postData!.pseudonym}
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
};
