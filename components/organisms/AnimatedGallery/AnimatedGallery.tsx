import { useContext, useEffect, useState } from 'react';
import { limit, onSnapshot, orderBy, query } from 'firebase/firestore';

import { animationsCollectionRef } from 'references/referencesFirebase';

import { DataType, FileType } from 'types/global.types';

import { Photos } from 'components/atoms/Photos/Photos';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { pagination } from 'helpers/pagination';

import { ModeContext } from 'providers/ModeProvider';

import styles from './AnimatedGallery.module.scss';
import { Skeleton } from '@chakra-ui/react';
import { Pagination } from 'antd';

export const AnimatedGallery = ({ data }: DataType) => {
  const { isMode } = useContext(ModeContext);
  const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const maxItems: number = 15;
  const nextPage = query(animationsCollectionRef(), orderBy('timeCreated', 'desc'), limit(maxItems));
  
  const downloadAnimations = async () => {
    try {
      onSnapshot(nextPage, (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach((doc) => {
            filesArray.push({
              fileUrl: doc.data().fileUrl,
              description: doc.data().description,
              time: doc.data().timeCreated
            });
          });
          setUserAnimatedPhotos(filesArray);
          setLoading(true)
        },
        (e) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.log('No such document!');
    }
  };
  
  useEffect(() => {
    downloadAnimations();
  }, []);
  
  
  return (
    <article id='user__gallery__in__account' className={styles.user__gallery__in__account}>
      <em className={styles.title}>{data?.Account?.gallery?.userAnimationsTitle}</em>
      
      <div className={styles.user__animated__photos}>
        {
          userAnimatedPhotos !== [] ? userAnimatedPhotos.map(({ fileUrl, description, time }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
              margin='1rem'
            >
              <Photos
                link={fileUrl}
                description={description}
                unopt={true}
              />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.animations} />
        }
      </div>
      
      <Pagination
        className={`pagination ${isMode ? 'pagination-dark' : ''}`}
        defaultCurrent={1}
        defaultPageSize={maxItems}
        showSizeChanger={false}
        total={userAnimatedPhotos.length}
        simple
        hideOnSinglePage
        itemRender={pagination(nextPage)}
      />
      
      <em className={styles.title}>{data?.Account?.gallery?.userLikedAnimations}</em>
      
      <div className={styles.like__animated__photos}>
        <ZeroFiles text={data?.ZeroFiles?.likedAnimations} />
      </div>
    </article>
  );
};