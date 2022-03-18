import Image from 'next/image';
import { ArticleImgType } from 'types/global.types';

import { FileOptions } from 'components/atoms/FileOptions/FileOptions';
import { DeletionFile } from 'components/atoms/DeletionFile/DeletionFile';

import styles from './Article.module.scss';

import { useUserData } from 'hooks/useUserData';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { Icon } from '@chakra-ui/react'

export const Article = ({ imgLink, refFile, refStorage, subCollection, imgDescription, authorName, unopt }: ArticleImgType) => {
  let img = 600;
  const { pseudonym } = useUserData();

return (
  <div className={styles.article}>
    {
      pseudonym === authorName &&
      <DeletionFile
      description={imgDescription}
      subCollection={subCollection}
      refFile={refFile}
      refStorage={refStorage!}
    />
    }
    
    <Image
      className={styles.item}
      src={imgLink}
      alt={imgDescription}
      width={img}
      height={img}
      unoptimized={unopt}
      priority
    />
    
    <FileOptions authorName={authorName} />
  </div>
  );
};
