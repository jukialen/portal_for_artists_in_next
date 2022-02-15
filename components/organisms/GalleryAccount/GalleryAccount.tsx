import { ReactElement, useContext, useEffect, useState } from 'react';
import { list, ref } from 'firebase/storage';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { auth, db, storage } from '../../../firebase';
import { Skeleton } from '@chakra-ui/react';

import { DataType } from 'types/global.types';

import { Photos } from 'components/atoms/Photos/Photos';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Pagination } from 'antd';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';

import { ModeContext } from 'providers/ModeProvider';

import styles from './GalleryAccount.module.scss';

type FileType = {
  fileUrl: string;
  description: string;
  time: string;
}

export const GalleryAccount = ({ data }: DataType) => {
  const user = auth.currentUser;
  const userFilesRef = ref(storage, `${user?.uid}`);
  const maxItems: number = 20;
  
  const { isMode } = useContext(ModeContext);
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const downloadFiles = async () => {
    const photosRef = collection(db, `users/${user?.uid}/photos`);
    const nextPage = query(photosRef, orderBy('timeCreated', 'desc'), limit(maxItems));
  
    try {
      const filesArray: FileType[] = [];
      const querySnapshot = await getDocs(nextPage);
      querySnapshot.forEach((doc) => {
        filesArray.push({
          fileUrl: doc.data().photoURL,
          description: doc.data().description,
          time: doc.data().timeCreated
        });
      });
      console.log(filesArray)
      setUserPhotos(filesArray);
      setLoading(true);
    } catch (e) {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    downloadFiles();
  }, []);
  
  const nextFiles = async () => {
    const firstPage = await list(userFilesRef, { maxResults: maxItems });
    if (!!firstPage.nextPageToken) {
      await list(userFilesRef, {
        maxResults: maxItems,
        pageToken: firstPage.nextPageToken,
      });
    }
  };
  
  const itemRender = (current: number, type: string, originalElement: ReactElement) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
  
    if (type === 'next') {
      return <a onClick={() => nextFiles()}>Next</a>;
    }
  
    return originalElement;
  };
  
  
  return (
    <article id='user__gallery__in__account' className={styles.user__gallery__in__account}>
      <FilesUpload />
      
      <em className={styles.title}>{data?.Account?.gallery?.userFilesTitle}</em>
      
      <div className={styles.user__photos}>
        {
          !!userPhotos ? userPhotos.map(({ fileUrl, description, time }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
              margin='1rem'
            >
              <Photos
                link={fileUrl}
                description={description}
              />
            </Skeleton>) :
            <ZeroFiles text='No your photos, animations and films.' />
          
        }
      </div>
      
      <Pagination
        className={`pagination ${isMode ? 'pagination-dark' : ''}`}
        defaultCurrent={1}
        defaultPageSize={maxItems}
        showSizeChanger={false}
        total={userPhotos.length}
        simple
        hideOnSinglePage
        itemRender={itemRender}
      />
      
      <em className={styles.title}>{data?.Account?.gallery?.userLikedFiles}</em>
      
      <div className={styles.like__photos}>
        <ZeroFiles text='No liked photos, animations and films.' />
      </div>
    </article>
  );
};
