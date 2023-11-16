'use client'

import { useState } from 'react';
import { Link } from '@chakra-ui/next-js';

import { Tags } from 'types/global.types';

import { useCurrentLocale, useScopedI18n } from "locales/client";

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { SharingButton } from 'components/atoms/SharingButton/SharingButton';
import { FilesComments } from 'components/molecules/FilesComments/FilesComments';

import styles from './FileOptions.module.scss';
import { ClientPortalWrapper } from "../../atoms/ClientPortalWrapper/ClientPortalWrapper";

type FileOptionsType = {
  fileId: string;
  authorName: string;
  profilePhoto: string;
  tags: Tags;
  name: string;
};

export const FileOptions = ({ fileId, authorName, profilePhoto, tags, name }: FileOptionsType) => {
  const [open, setOpen] = useState(false);
  const locale = useCurrentLocale();
  
  const tComments = useScopedI18n('Comments');
  const showOpenComments = () => setOpen(!open);

  const linkShare = `${process.env.NEXT_PUBLIC_PAGE}/post/${authorName}/${tags}/${name}`;

  return (
    <div className={styles.options}>
      <div className={styles.bottomPanel}>
        <div className={styles.author__name}>
          <Link href={`${locale === 'en' ? '/' : `/${locale}/`}user/${authorName}`}>{authorName}</Link>
        </div>

        <SharingButton shareUrl={linkShare} authorName={authorName!} tags={tags} name={name} />
      </div>
      <button className={styles.comments} onClick={showOpenComments}>
        {tComments('comments')}
      </button>
      {open && (
        <>
          <NewComments profilePhoto={profilePhoto} fileId={fileId} />
          {/*<ClientPortalWrapper>*/}
            {/*<FilesComments fileId={fileId} />*/}
          {/*</ClientPortalWrapper>*/}
        </>
      )}
    </div>
  );
};