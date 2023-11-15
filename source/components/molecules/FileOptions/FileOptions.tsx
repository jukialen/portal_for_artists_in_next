import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Tags } from 'source/types/global.types';

<<<<<<< Updated upstream:components/molecules/FileOptions/FileOptions.tsx
import { useHookSWR } from 'hooks/useHookSWR';
=======
import { useCurrentLocale, useScopedI18n } from "source/locales/client";
>>>>>>> Stashed changes:source/components/molecules/FileOptions/FileOptions.tsx

import { NewComments } from 'source/components/atoms/NewComments/NewComments';
import { SharingButton } from 'source/components/atoms/SharingButton/SharingButton';
import { FilesComments } from 'source/components/molecules/FilesComments/FilesComments';

import styles from './FileOptions.module.scss';

type FileOptionsType = {
  fileId: string;
  authorName: string;
  profilePhoto: string;
  tags: Tags;
  name: string;
};

export const FileOptions = ({ fileId, authorName, profilePhoto, tags, name }: FileOptionsType) => {
  const [open, setOpen] = useState(false);
  const { locale } = useRouter();

  const data = useHookSWR();

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
        {data?.Comments?.comments}
      </button>
      {open && (
        <>
          <NewComments profilePhoto={profilePhoto} fileId={fileId} />
          <FilesComments fileId={fileId} />
        </>
      )}
    </div>
  );
};
