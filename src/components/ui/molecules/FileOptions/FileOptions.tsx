'use client';

import Link from 'next/link';

import { useScopedI18n } from 'locales/client';

import { Tags } from 'types/global.types';

import { SharingButton } from 'components/ui/atoms/SharingButton/SharingButton';

import styles from './FileOptions.module.scss';

type FileOptionsType = {
  linkShare: string;
  authorName: string;
  fileUrl: string;
  tags: Tags;
  name: string;
};

export const FileOptions = ({ authorName, tags, name, linkShare }: FileOptionsType) => {
  const tComments = useScopedI18n('Comments');

  return (
    <div className={styles.options}>
      <div className={styles.bottomPanel}>
        <div className={styles.author__name}>
          <Link href={`/user/${authorName}`}>{authorName}</Link>
        </div>

        <SharingButton shareUrl={linkShare} authorName={authorName!} tags={tags} name={name} />
      </div>

      <Link href={linkShare} className={styles.linkToComments} aria-label="link to this file page">
        {tComments('comments')}
      </Link>
    </div>
  );
};
