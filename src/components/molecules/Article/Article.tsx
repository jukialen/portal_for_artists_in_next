import Image from 'next/image';
import { getCurrentLocale, getScopedI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';

import { ArticleVideosType } from 'types/global.types';

import { FileOptions } from 'components/molecules/FileOptions/FileOptions';
import { DeletionFile } from 'components/molecules/DeletionFile/DeletionFile';

import styles from './Article.module.scss';

export const Article = async ({
  fileId,
  name,
  fileUrl,
  authorName,
  authorId,
  pseudonym,
  profilePhoto,
  shortDescription,
  tags,
  time,
}: ArticleVideosType) => {
  let img = 600;
  const locale = getCurrentLocale();
  const tComments = await getScopedI18n('Comments');
  const dataDateObject = await dateData();

  return (
    <div className={styles.article}>
      {authorName === pseudonym && <DeletionFile name={name!} />}
      
      <Image
        className={styles.item}
        src={fileUrl}
        alt={`File ${name} added by ${authorName} in Category: ${tags}`}
        width={img}
        height={img}
        unoptimized={`${tags}` === 'animations'}
        priority
      />
      <div className={styles.time}>{time}</div>

      <div className={styles.shortDescription}>{shortDescription}</div>

      <FileOptions
        fileId={fileId}
        authorName={authorName!}
        authorId={authorId}
        pseudonym={pseudonym!}
        fileUrl={fileUrl}
        profilePhoto={profilePhoto}
        tags={tags!}
        name={name!}
        dataDateObject={dataDateObject}
        noComments={tComments('noComments')}
        locale={locale}
      />
    </div>
  );
};
