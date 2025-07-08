'use client';

import { useState } from 'react';
import Link from 'next/link'

import { Tags } from 'types/global.types';

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { FilesComments } from 'components/molecules/FilesComments/FilesComments';
import { NewComments } from 'components/atoms/NewComments/NewComments';
import { SharingButton } from 'components/atoms/SharingButton/SharingButton';

import styles from './FileOptions.module.scss';

type FileOptionsType = {
  fileId: string;
  authorName: string;
  profilePhoto: string;
  authorId: string;
  fileUrl: string;
  tags: Tags;
  name: string;
  noComments: string;
  roleId: string;
};

export const FileOptions = ({
  fileId,
  authorName,
  profilePhoto,
  tags,
  name,
  authorId,
  noComments,
  roleId,
}: FileOptionsType) => {
  const [open, setOpen] = useState(false);
  const showOpenComments = () => setOpen(!open);

  const linkShare = `${process.env.NEXT_PUBLIC_PAGE}/shared/${name}${fileId}/${authorName}`;

  return (
    <div className={styles.options}>
      <div className={styles.bottomPanel}>
        <div className={styles.author__name}>
          <Link href={`/user/${authorName}`}>{authorName}</Link>
        </div>

        <SharingButton shareUrl={linkShare} authorName={authorName!} tags={tags} name={name} />
      </div>
      <button className={styles.comments} onClick={showOpenComments}>
        {noComments}
      </button>
      {open && (
        <>
          <NewComments
            fileId={fileId}
            authorId={authorId}
            profilePhoto={profilePhoto}
            roleId={roleId}
          />
          <ClientPortalWrapper>
            <FilesComments fileId={fileId} />
          </ClientPortalWrapper>
        </>
      )}
    </div>
  );
};
