import Image from 'next/image';
import { getScopedI18n } from "locales/server";
import { Tag } from 'components/ui/tag';

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
  authorBool,
  profilePhoto,
  shortDescription,
  tags,
  time,
  roleId,
}: ArticleVideosType) => {
  let img = 600;
  const tComments = await getScopedI18n('Comments');
  return (
    <div className={styles.article}>
      {authorBool && <DeletionFile fileId={fileId} />}

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
      <Tag variant="subtle" color="blue">
        {tags}
      </Tag>

      <FileOptions
        fileId={fileId}
        authorName={authorName!}
        authorId={authorId}
        fileUrl={fileUrl}
        profilePhoto={profilePhoto}
        tags={tags!}
        name={name!}
        noComments={tComments('noComments')}
        roleId={roleId}
      />
    </div>
  );
};
