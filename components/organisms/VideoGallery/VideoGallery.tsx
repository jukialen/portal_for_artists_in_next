import { useContext, useEffect, useState } from 'react';

import {
  limit,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';

import { videosCollectionRef } from 'references/referencesFirebase';

import { DataType, FileType } from 'types/global.types';

import { Videos } from 'components/atoms/Videos/Videos';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';

import { ModeContext } from 'providers/ModeProvider';

import styles from './VideoGallery.module.scss';
import { Skeleton } from '@chakra-ui/react';
import { Pagination } from 'antd';
import { pagination } from 'helpers/pagination';

export const VideoGallery = ({ data }: DataType) => {
  const maxItems: number = 10;
  const nextPage = query(videosCollectionRef(), orderBy('timeCreated', 'desc'), limit(maxItems));
  
  const { isMode } = useContext(ModeContext);
  const [userVideos, setUserVideos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const downloadVideos = async () => {
    try {
      onSnapshot(nextPage,  (querySnapshot) => {
          
          const filesArray: FileType[] = [];
          querySnapshot.forEach((doc) => {
            filesArray.push({
              fileUrl: doc.data().fileUrl,
              time: doc.data().timeCreated
            });
          });
          setUserVideos(filesArray);
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
    downloadVideos();
  }, []);
  
  
  return (
    <article id='user__gallery__in__account' className={styles.user__gallery__in__account}>
      
      <em className={styles.title}>{data?.Account?.gallery?.userFilesTitle}</em>
      
      <div className={styles.user__videos}>
        {
          userVideos !== [] ? userVideos.map(({ fileUrl, time }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
              margin='1rem'
            >
              <Videos link={fileUrl} />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.videos} />
        }
      </div>
      
      <Pagination
        className={`pagination ${isMode ? 'pagination-dark' : ''}`}
        defaultCurrent={1}
        defaultPageSize={maxItems}
        showSizeChanger={false}
        total={userVideos.length}
        simple
        hideOnSinglePage
        itemRender={pagination(nextPage)}
      />
      
      <em className={styles.title}>{data?.Account?.gallery?.userLikedFiles}</em>
      
      <div className={styles.like__videos}>
        <ZeroFiles text={data?.ZeroFiles?.likedVideos} />
      </div>
    </article>
  );
};
