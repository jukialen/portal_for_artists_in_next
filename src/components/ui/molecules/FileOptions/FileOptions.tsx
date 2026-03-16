import Link from 'next/link';

import { getScopedI18n } from 'locales/server';

import { Tags } from 'types/global.types';

import { SharingButton } from 'components/ui/atoms/SharingButton/SharingButton';

import styles from './FileOptions.module.scss';

type FileOptionsType = {
  linkShare: string;
  authorName: string;
  fileUrl: string;
  tags: Tags;
  name: string;
  commentsBool: boolean;
  fileId?: string;
};

export const FileOptions = async ({ authorName, tags, name, linkShare, commentsBool, fileId }: FileOptionsType) => {
  const tComments = await getScopedI18n('Comments');

  return (
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
  );
};
