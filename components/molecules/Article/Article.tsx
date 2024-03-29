import { useContext } from 'react';
import Image from 'next/image';

import { ModeContext } from 'providers/ModeProvider';

import { FileContainerType } from 'types/global.types';

import { useUserData } from 'hooks/useUserData';
import { FileOptions } from 'components/molecules/FileOptions/FileOptions';
import { DeletionFile } from 'components/molecules/DeletionFile/DeletionFile';

import styles from './Article.module.scss';

export const Article = ({
  link,
  refFile,
  refStorage,
  subCollection,
  description,
  authorName,
  unopt,
  tag,
  uid,
  idPost,
}: FileContainerType) => {
  const { isMode } = useContext(ModeContext);
  const { pseudonym } = useUserData();
  let img = 600;

  return (
    <div className={styles.article}>
      {pseudonym === authorName && (
        <DeletionFile
          description={description}
          subCollection={subCollection!}
          refFile={refFile!}
          refStorage={refStorage!}
        />
      )}
      <Image
        className={isMode ? styles.item : styles.item__dark}
        src={link!}
        alt={description}
        width={img}
        height={img}
        unoptimized={unopt}
        priority
      />

      <FileOptions
        authorName={authorName}
        refFile={refFile}
        subCollection={subCollection}
        tag={tag}
        description={description}
        uid={uid}
        idPost={idPost}
      />
    </div>
  );
};
