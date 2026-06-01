'use client';
import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

import { getUserData } from 'helpers/getUserData';
import { useScopedI18n } from 'locales/client';
import { filesApiComments } from 'utils/comments';

import { backUrl } from 'constants/links';
import { supabaseStorageProfileUrl } from 'constants/links';
import { TagConstants } from 'constants/values';
import { ArticleVideosType, FilesCommentsType, UserType } from 'types/global.types';

import { DCContext, DCProvider } from 'providers/DeleteCommentProvider';

const DeletionFile = dynamic(() => import('../DeletionFile/DeletionFile').then((df) => df.DeletionFile));
import { NewComments } from 'components/functional/atoms/NewComments/NewComments';
import { OptionsComments } from 'components/functional/molecules/OptionsComments/OptionsComments';
import { SubComments } from 'components/functional/molecules/SubComments/SubComments';
import { Avatar } from 'components/ui/atoms/Avatar/Avatar';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';
import { SharingButton } from 'components/ui/atoms/SharingButton/SharingButton';

import styles from './FileContainer.module.css';

export const FileContainer = ({
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
}: ArticleVideosType) => {
  const maxItems = 30;
  const linkShare = `${backUrl}/file/${name}/${fileId}/${authorName}`;
  const Tags = tags[0].toUpperCase() + tags.slice(1);

  const { del } = useContext(DCContext);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [comments, setComments] = useState<FilesCommentsType[]>([]);
  const [lastVisible, setLastVisible] = useState(
    comments.length === maxItems ? comments[comments.length - 1].createdAt : '',
  );

  const tComments = useScopedI18n('Comments');

  useEffect(() => {
    getUserData().then((data) => setUserData(data));

    commentsBool && filesApiComments(fileId, maxItems).then((data) => setComments(data));
  }, [linkShare, commentsBool, fileId]);

  let [i, setI] = useState(1);

  const nextComments = async () => {
    try {
      const nextPage = (await filesApiComments(fileId, maxItems, 'again'))!;

      nextPage.length === maxItems && setLastVisible(nextPage[nextPage.length - 1].createdAt!);

      const nextArray = comments.concat(...nextPage);
      setComments(nextArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <article className={styles.file}>
        {authorBool && <DeletionFile fileId={fileId} />}

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

          <div className={styles.tags}>{Tags}</div>
        </section>

        <div className={styles.shortDescription}>
          {shortDescription.length <= 36 ? shortDescription : shortDescription.slice(0, 36) + '...'}
        </div>

        <div className={styles.options}>
          <div className={styles.bottomPanel}>
            <div className={styles.author__name}>
              <Link href={`/user/${authorName}`}>{authorName}</Link>
            </div>

            <SharingButton shareUrl={linkShare} authorName={authorName!} tags={tags} name={name} />
          </div>

          {!commentsBool && (
            <Link href={linkShare} className={styles.linkToComments} aria-label="link to this file page">
              {tComments('comments')}
            </Link>
          )}
        </div>
      </article>
      {commentsBool && (
        <>
          <NewComments
            fileId={fileId!}
            authorId={authorId}
            profilePhoto={userData?.profilePhoto || ''}
            roleId={roleId}
          />
          {comments.length > 0 ? (
            comments.map((data: FilesCommentsType, index) => (
              <DCProvider key={index}>
                <div className={del ? styles.container__deleted : styles.container}>
                  <div className={styles.comment}>
                    <Avatar
                      src={`${supabaseStorageProfileUrl}/${data.authorProfilePhoto}`}
                      fallbackName={data.authorName}
                      alt="author profile photo icon"
                    />
                    <div className={styles.rightSideComment}>
                      <div className={styles.topPartComment}>
                        <p className={styles.pseudonym}>
                          <Link href={`/user/${data.authorName}`}>{data.authorName}</Link>
                        </p>
                        <p className={styles.date}>{data.date}</p>
                      </div>
                      <h2 className={styles.text}>{data.content}</h2>
                    </div>
                  </div>
                  <OptionsComments
                    fileId={fileId}
                    fileCommentId={data.fileCommentId}
                    authorId={authorId}
                    userId={authorId}
                    liked={data.liked}
                    likes={data.likes}
                    authorProfilePhoto={data.authorProfilePhoto}
                    roleId={roleId!}
                    comment={data.content}
                    tableName="FilesComments">
                    <SubComments fileCommentId={data.fileCommentId} fileId={fileId} />
                  </OptionsComments>
                </div>
              </DCProvider>
            ))
          ) : (
            <p className={styles.noComments}>{tComments('noComments')}</p>
          )}
          {!!lastVisible && comments.length === maxItems * i && <MoreButton nextElementsAction={nextComments} />}
        </>
      )}
    </>
  );
};
