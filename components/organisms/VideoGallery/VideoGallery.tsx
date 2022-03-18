import { useEffect, useState } from 'react';

import {
  limit,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';

import { videosCollectionRef } from 'references/referencesFirebase';

import { DataType, FileType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Videos } from 'components/molecules/Videos/Videos';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';

import styles from './VideoGallery.module.scss';
import { Skeleton } from '@chakra-ui/react';
import { ref } from 'firebase/storage';
import { auth, storage } from '../../../firebase';

export const VideoGallery = ({ data }: DataType) => {
  const maxItems: number = 10;
  const nextPage = query(videosCollectionRef(), orderBy('timeCreated', 'desc'), limit(maxItems));
  const [userVideos, setUserVideos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const user = auth?.currentUser;
  
  const downloadVideos = async () => {
    try {
      onSnapshot(nextPage,  (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach((doc) => {
            filesArray.push({
              fileUrl: doc.data().fileUrl,
              time: doc.data().timeCreated,
              description: doc.data().description
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
      
      <em className={styles.title}>{data?.Account?.gallery?.userVideosTitle}</em>
      
      <Wrapper>
        {
          userVideos.length > 0 ?
            userVideos.map(({ fileUrl, description, time }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
            >
              <Videos
                link={fileUrl}
                refFile={videosCollectionRef()}
                refStorage={ref(storage, `${user?.uid}/videos/${description}`)}
                description={description}
              />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.videos} />
        }
      </Wrapper>
    </article>
  );
};
