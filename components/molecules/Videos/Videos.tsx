import styles from './Videos.module.scss';

import { useUserData } from 'hooks/useUserData';

import { FileContainerType } from 'types/global.types';

import { DeletionFile } from 'components/molecules/DeletionFile/DeletionFile';
import { FileOptions } from 'components/molecules/FileOptions/FileOptions';

export const Videos = ({ link, description, refFile, refStorage, authorName, tag, uid, idPost }: FileContainerType) => {
  const { pseudonym } = useUserData();
  
  return (
    <div className={styles.videos}>
      {
        pseudonym === authorName && <DeletionFile
          description={description}
          subCollection='videos'
          refFile={refFile!}
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
      
      <FileOptions
        authorName={authorName}
        refFile={refFile}
        link={link}
        subCollection='videos'
        tag={tag}
        description={description}
        uid={uid}
        idPost={idPost}
      />
    </div>
  )
}