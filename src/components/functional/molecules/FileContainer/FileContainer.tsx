'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

import { getUserData } from 'helpers/getUserData';
import { useI18n, useScopedI18n } from 'locales/client';
import { createClient } from 'utils/supabase/clientCSR';
import { comments } from 'utils/comments';

import { backUrl, supabaseStorageUrlFilesUrl } from 'constants/links';
import { TagConstants } from 'constants/values';
import { ArticleVideosType, CommentType, UserType } from 'types/global.types';

const DeletionFile = dynamic(() => import('../DeletionFile/DeletionFile').then((df) => df.DeletionFile));
import { NewComments } from 'components/functional/atoms/NewComments/NewComments';
import { Comment } from 'components/functional/atoms/Comment/Comment';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';
import { SharingButton } from 'components/ui/atoms/SharingButton/SharingButton';

import styles from './FileContainer.module.css';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

export const FileContainer = ({ fileData }: { fileData: ArticleVideosType }) => {
  const {
    name,
    fileUrl,
    authorName,
    shortDescription,
    tags,
    time,
    fileId,
    authorBool,
    authorId,
    roleId,
    commentsBool = false,
    idLiked,
    likes = 0,
    liked = false,
  } = fileData;
  const maxItems = 30;
  const linkShare = `${backUrl}/file/${name}/${fileId}/${authorName}`;
  const Tags = tags[0].toUpperCase() + tags.slice(1);

  const [newReply, setNewReply] = useState<CommentType | null>(null);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [commentsData, setCommentsData] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState(
    commentsData.length === maxItems ? commentsData[commentsData.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);
  let [like, setLike] = useState(liked);
  let [likeCount, setLikeCount] = useState(likes);

  const tComments = useScopedI18n('Comments');
  const t = useI18n();

  useEffect(() => {
    if (newReply) {
      setCommentsData((prev) => [newReply, ...prev]);
      commentsData.length >= maxItems * i && setI((prev) => prev + 1);
      setNewReply(null);
    }
  }, [newReply]);

  useEffect(() => {
    getUserData().then((data) => setUserData(data));

    commentsBool && comments({ maxItems, fileId }).then((data) => setCommentsData(data));
  }, [linkShare, commentsBool, fileId]);

  const nextComments = async () => {
    try {
      const nextPage = (await comments({ maxItems, step: 'again', fileId }))!;

      nextPage.length === maxItems && setLastVisible(nextPage[nextPage.length - 1].createdAt!);

      const nextArray = commentsData.concat(...nextPage);
      setCommentsData(nextArray);
      setI((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLike = async () => {
    const supabase = createClient();

    if (like) {
      const { error } = await supabase.from('Liked').delete().eq('id', idLiked!);

      if (!!error) {
        console.error(`Error: ${error?.message} with status ${error?.code}`);
      } else {
        setLike(false);
        setLikeCount(likeCount - 1);
      }
    } else {
      const { error } = await supabase.from('Liked').insert([{ fileId, userId: authorId }]);

      if (!!error) {
        console.error(`Error: ${error?.message} with status ${error?.code}`);
      } else {
        setLike(true);
        setLikeCount(likeCount + 1);
      }
    }
  };

  return (
    <article className={deleted ? styles.file__deleted : styles.file}>
      {authorBool && <DeletionFile fileId={fileId!} onDeletionAction={setDeleted} />}

      {tags === TagConstants[TagConstants.findIndex((v) => v === 'videos')] ? (
        <video preload="metadata" controls className={styles.video} playsInline>
          <source src={fileUrl} />
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Sorry, your browser doesn\'t support embedded videos,
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          but don't worry, you can <Link href={fileUrl}>download it</Link>
          and watch it with your favorite video player!
        </video>
      ) : (
        <Image
          className={styles.item}
          src={fileUrl}
          alt={`File ${name} added by ${authorName} in Category: ${tags}`}
          width={552}
          height={480}
          unoptimized
        />
      )}

      <section className={styles.timePlusTag}>
        <div className={styles.time}>{time}</div>

        <Link href={`/${tags}`} className={styles.tags}>
          {Tags}
        </Link>
      </section>

      <h2 className={styles.shortDescription}>
        {shortDescription!.length <= 36 ? shortDescription : shortDescription!.slice(0, 36) + '...'}
      </h2>

      <div className={styles.options}>
        <Link href={`/user/${authorName}`} className={styles.author_name}>
          {authorName}
        </Link>
        <button
          aria-label={like ? t('Posts.likedAria') : t('Posts.likeAria')}
          className={styles.likes}
          onClick={toggleLike}>
          {like ? <AiFillLike size="sm" /> : <AiOutlineLike size="sm" />}
        </button>
        <SharingButton shareUrl={linkShare} authorName={authorName!} tags={tags} name={name} shared={1000000} />
        <p></p>
        <p className={styles.likesCount}>{likeCount}</p>
        <p></p>
      </div>
      {!commentsBool && (
        <Link href={linkShare} className={styles.linkToComments} aria-label="link to this file page">
          {tComments('comments')}
        </Link>
      )}
      {commentsBool && (
        <>
          <NewComments
            fileId={fileId!}
            authorId={authorId}
            profilePhoto={userData?.profilePhoto!}
            roleId={roleId}
            onReplyAddedAction={setNewReply}
          />
          {commentsData.length > 0 ? (
            commentsData.map((data, i) => <Comment commentData={data} key={i} />)
          ) : (
            <p className={styles.noComments}>{tComments('noComments')}</p>
          )}
          {!!lastVisible && comments.length === maxItems * i && <MoreButton nextElementsAction={nextComments} />}
        </>
      )}
    </article>
  );
};
