import { useContext, useEffect, useState } from 'react';
import {
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { photosCollectionRef } from 'references/referencesFirebase';
import { pagination } from 'helpers/pagination';

import { DataType, FileType } from 'types/global.types';

import { Photos } from 'components/atoms/Photos/Photos';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';

import { ModeContext } from 'providers/ModeProvider';

import styles from './PhotosGallery.module.scss';
import { Skeleton } from '@chakra-ui/react';
import { Pagination } from 'antd';

export const PhotosGallery = ({ data }: DataType) => {
  const maxItems: number = 20;
  const nextPage = query(photosCollectionRef(), orderBy('timeCreated', 'desc'), limit(maxItems));
  
  const { isMode } = useContext(ModeContext);
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);

  const downloadFiles = async () => {
    try {
      onSnapshot(nextPage,  (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach((doc) => {
            filesArray.push({
              fileUrl: doc.data().fileUrl,
              description: doc.data().description,
              time: doc.data().timeCreated
            });
          });
          setUserPhotos(filesArray);
          setLoading(true);
        },
        (e) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    downloadFiles();
  }, []);
  
  
  return (
    <article id='user__gallery__in__account' className={styles.user__gallery__in__account}>
      <em className={styles.title}>{data?.Account?.gallery?.userFilesTitle}</em>

      <div className={styles.user__photos}>
        {
          userPhotos !== [] ? userPhotos.map(({ fileUrl, description, time }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
              margin='1rem'
            >
              <Photos
                link={fileUrl}
                description={description}
              />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.photos} />
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
        itemRender={pagination(nextPage)}
      />
      
      <em className={styles.title}>{data?.Account?.gallery?.userLikedFiles}</em>
      
      <div className={styles.like__photos}>
        <ZeroFiles text={data?.ZeroFiles?.likedPhotos} />
      </div>
    </article>
  );
};
