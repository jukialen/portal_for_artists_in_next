import Link from 'next/link';

import { getScopedI18n } from 'locales/server';
import { Locale } from 'utils/supabase/clientSSR';

import { ArticleVideosType } from 'types/global.types';

import { DeletionFile } from 'components/molecules/DeletionFile/DeletionFile';
import { FileOptions } from 'components/molecules/FileOptions/FileOptions';

import styles from './Videos.module.scss';

export const Videos = async ({
  name,
  fileUrl,
  authorName,
  authorId,
  tags,
  fileId,
  authorBool,
  profilePhoto,
  roleId,
}: ArticleVideosType) => {
  const tComments = await getScopedI18n('Comments');

  return (
    <div className={styles.videos}>
      {authorBool && <DeletionFile fileId={fileId} />}

      <video preload="metadata" controls className={styles.video} playsInline>
        <source src={fileUrl} />
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Sorry, your browser doesn\'t support embedded videos,
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        but don't worry, you can <Link href={fileUrl}>download it</Link>
        and watch it with your favorite video player!
      </video>

      <FileOptions
        fileId={fileId}
        authorName={authorName!}
        fileUrl={fileUrl}
        tags={tags!}
        name={name!}
        noComments={tComments('noComments')}
        authorId={authorId}
        profilePhoto={profilePhoto}
        roleId={roleId!}
      />
    </div>
  );
};
