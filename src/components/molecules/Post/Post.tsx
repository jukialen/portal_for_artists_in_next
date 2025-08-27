'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, IconButton } from '@chakra-ui/react';
import { Avatar } from 'components/atoms/Avatar/Avatar';

import { createClient } from 'utils/supabase/clientCSR';

import { backUrl } from 'constants/links';
import { PostsType } from 'types/global.types';

import { useI18n } from 'locales/client';

import { DeletePost } from 'components/atoms/DeletionPost/DeletionPost';
import { NewComments } from 'components/atoms/NewComments/NewComments';
import { SharingButton } from 'components/atoms/SharingButton/SharingButton';
import { Comments } from 'components/molecules/Comments/Comments';

import styles from './Post.module.scss';
import group from '../../../../public/group.svg';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

export const Post = ({
  userId,
  name,
  profilePhoto,
  postOnGroup,
}: {
  userId: string;
  name: string;
  profilePhoto: string;
  postOnGroup: PostsType;
}) => {
  const {
    postId,
    title,
    content,
    likes,
    shared,
    commented,
    authorId,
    groupId,
    date,
    liked,
    authorName,
    authorProfilePhoto,
    roleId,
    idLiked,
  } = postOnGroup;

  const [showComments, setShowComments] = useState(false);
  let [like, setLike] = useState(liked);
  let [likeCount, setLikeCount] = useState(likes);

  const link = `${backUrl}/groups/${name}/${authorName}/${postId}`;
  const supabase = createClient();

  const showingComments = () => setShowComments(!showComments);

  const addLike = async () => {
    if (like) {
      const { error } = await supabase.from('Liked').delete().eq('id', idLiked!);

      if (!!error) {
        console.error(`Error: ${error?.message} with status ${error?.code}`);
      } else {
        setLike(false);
        setLikeCount(likeCount - 1);
      }
    } else {
      const { error } = await supabase.from('Liked').insert([{ postId, userId: authorId }]);

      if (!!error) {
        console.error(`Error: ${error?.message} with status ${error?.code}`);
      } else {
        setLike(true);
        setLikeCount(likeCount + 1);
      }
    }
  };

  const t = useI18n();

  return (
    <article className={styles.container}>
      <div className={styles.avatarWithUsername}>
        <Avatar src={authorProfilePhoto || group} />
        <div className={styles.username}>
          <Link href={`/user/${authorName}`}>{authorName}</Link>
          <div className={styles.time}>{date}</div>
        </div>
        {userId === authorId && <DeletePost postId={postId!} groupId={groupId} />}
      </div>
      <div className={styles.titlePost}>{title}</div>
      <div className={styles.description}>{content}</div>
      <div className={styles.options}>
        <IconButton
          aria-label={like ? t('Posts.likedAria') : t('Posts.likeAria')}
          colorScheme="teal"
          className={styles.likes}
          onClick={addLike}>
          {like ? <AiFillLike size="sm" /> : <AiOutlineLike size="sm" />}
        </IconButton>
        <Button colorScheme="blue" onClick={showingComments} className={styles.commentsButton} variant="ghost">
          {t('Comments.comments')}
        </Button>
        <SharingButton shareUrl={link} authorName={authorName} name={title} />
      </div>
      <div className={styles.likesShComs}>
        <p>{likeCount}</p>
        <p>SHared: {shared}</p>
        <p>
          {commented} {commented === 1 ? 'comment' : 'comments'}
        </p>
      </div>
      <article className={`${styles.commentsSection} ${showComments ? styles.showComments : ''}`}>
        <NewComments authorId={authorId} profilePhoto={profilePhoto} roleId={roleId} postId={postId} />
        <Comments postId={postId!} roleId={roleId} />
      </article>
    </article>
  );
};
