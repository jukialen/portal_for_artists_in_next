import styles from './Videos.module.scss';

import { FileOptions } from 'components/atoms/FileOptions/FileOptions';
import { CollectionReference, Query } from 'firebase/firestore';
import { StorageReference } from 'firebase/storage';

import { useUserData } from 'hooks/useUserData';
import { DeletionFile } from 'components/atoms/DeletionFile/DeletionFile';

type VideoType = {
  link: string;
  authorName?: string;
  refFile: CollectionReference | Query;
  refStorage?:  StorageReference;
  description?: string;
};

export const Videos = ({ link, description, refFile, refStorage, authorName }: VideoType) => {
  const { pseudonym } = useUserData();
  
  return (
    <div className={styles.videos}>
      {
        pseudonym === authorName && <DeletionFile
          description={description}
          subCollection='videos'
          refFile={refFile}
          refStorage={refStorage!}
        />
      }
      
      <video preload='metadata' controls className={styles.video} playsInline>
        <source src={link} />
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Sorry, your browser doesn't support embedded videos,
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        but don't worry, you can <a href={link}>download it</a>
        and watch it with your favorite video player!
      </video>
      
      <FileOptions authorName={authorName} />
    </div>
  )
}