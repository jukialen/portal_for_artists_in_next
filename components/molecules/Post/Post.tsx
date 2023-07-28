import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Avatar, Button, IconButton } from '@chakra-ui/react';

import { PostType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import { DeletePost } from 'components/atoms/DeletionPost/DeletionPost';
import { NewComments } from 'components/atoms/NewComments/NewComments';
import { SharingButton } from 'components/atoms/SharingButton/SharingButton';
import { Comments } from 'components/molecules/Comments/Comments';

import styles from './Post.module.scss';
import group from 'public/group.svg';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

export const Post = ({
  pseudonym,
  title,
  date,
  content,
  name,
  postId,
  authorId,
  likes,
  liked,
  commented,
  shared,
  profilePhoto,
}: PostType) => {
  const [showComments, setShowComments] = useState(false);
  let [like, setLike] = useState(liked);
  let [likeCount, setLikeCount] = useState(likes);

  const { id } = useUserData();
  const data = useHookSWR();

  const link = `${process.env.NEXT_PUBLIC_PAGE}/groups/${name}/${pseudonym}/${postId}`;

  const showingComments = () => setShowComments(!showComments);

  const addLike = async () => {
    if (like) {
      await axios.patch(`${backUrl}/posts/${title}`, {
        id,
        likes: (likeCount += 1),
      });
    } else {
      await axios.patch(`${backUrl}/posts/${title}`, {
        id,
        likes: (likeCount -= 1),
      });
    }
    setLikeCount(like ? (likeCount -= 1) : (likeCount += 1));
    setLike(!like);
  };

  return (
    <article className={styles.container}>
      <div className={styles.avatarWithUsername}>
        <Avatar src={`${cloudFrontUrl}/${profilePhoto}` || group} />
        <div className={styles.username}>
          <Link href={`/user/${pseudonym}`}>{pseudonym}</Link>
          <div className={styles.time}>{date}</div>
        </div>
        {id === authorId && <DeletePost postId={postId!} />}
      </div>
      <div className={styles.titlePost}>{title}</div>
      <div className={styles.description}>{content}</div>
      <div className={styles.options}>
        <IconButton
          aria-label={like ? data?.Posts?.likedAria : data?.Posts?.likeAria}
          colorScheme="teal"
          icon={like ? <AiFillLike size="sm" /> : <AiOutlineLike size="sm" />}
          className={styles.likes}
          onClick={addLike}
        />
        <Button colorScheme="blue" onClick={showingComments} className={styles.commentsButton} variant="ghost">
          {data?.Comments?.comments}
        </Button>
        <SharingButton fileUrl={link} pseudonym={pseudonym} time={date!} />
      </div>
      <p className={styles.likesCount} style={{ marginLeft: likeCount < 10 ? '.8rem' : '.5rem' }}>
        {likeCount}
      </p>
      <article className={`${styles.commentsSection} ${showComments ? styles.showComments : ''}`}>
        <NewComments name={nameGroup} refCom={addingPostComment(nameGroup, idPost!)} />
        <Comments refCom={postsComments(nameGroup, idPost!)} idPost={idPost!} groupSource />
      </article>
    </article>
  );
};
