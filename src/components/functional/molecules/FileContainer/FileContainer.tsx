'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { getUserData } from 'helpers/getUserData';
import { useScopedI18n } from 'locales/client';
import { filesAgainComments } from 'utils/comments';

import { backUrl } from 'constants/links';
import { TagConstants } from 'constants/values';
import { ArticleVideosType, FilesCommentsType, UserType } from 'types/global.types';

const DeletionFile = dynamic(() => import('../DeletionFile/DeletionFile').then((df) => df.DeletionFile));
import { SharingButton } from 'components/ui/atoms/SharingButton/SharingButton';
import { NewComments } from 'components/functional/atoms/NewComments/NewComments';
import { FilesCommentsClient } from 'components/functional/organisms/FilesCommentsClient/FilesCommentsClient';

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
  const linkShare = `${backUrl}/file/${name}/${fileId}/${authorName}`;
  const Tags = tags[0].toUpperCase() + tags.slice(1);
  const [userData, setUserData] = useState<UserType | undefined>(undefined);
  const [comments, setComments] = useState<FilesCommentsType[]>([]);

  const tComments = useScopedI18n('Comments');
  const maxItems = 30;

  useEffect(() => {
    // Pobieranie danych użytkownika
    getUserData().then((data) => setUserData(data));

    // Pobieranie komentarzy jeśli są włączone
    commentsBool && filesAgainComments(fileId, maxItems).then((data) => setComments(data));
  }, [linkShare, commentsBool, fileId]);

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
          <img className={styles.item} src={fileUrl} alt={`File ${name} added by ${authorName} in Category: ${tags}`} />
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
          <FilesCommentsClient
            firstFilesComments={comments}
            fileId={fileId}
            noComments={tComments('noComments')}
            pseudonym={userData?.pseudonym!}
          />
        </>
      )}
    </>
  );
};
