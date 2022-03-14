import { useEffect, useState } from 'react';
import { limit, onSnapshot, orderBy, query } from 'firebase/firestore';

import { animationsCollectionRef } from 'references/referencesFirebase';

import { DataType, FileType } from 'types/global.types';

import { Article } from 'components/molecules/Article/Article';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';

import styles from './AnimatedGallery.module.scss';
import { Skeleton } from '@chakra-ui/react';

export const AnimatedGallery = ({ data }: DataType) => {
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
          userAnimatedPhotos.length > 0 ?
            userAnimatedPhotos.map(({ fileUrl, description, time }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
            >
              <Article imgLink={fileUrl} imgDescription={description} unopt />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.animations} />
        }
      </div>
    </article>
  );
};