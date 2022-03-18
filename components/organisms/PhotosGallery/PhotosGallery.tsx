import { useEffect, useState } from 'react';
import {
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { photosCollectionRef } from 'references/referencesFirebase';

import { DataType, FileType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';

import styles from './PhotosGallery.module.scss';
import { Skeleton } from '@chakra-ui/react';
import { ref } from 'firebase/storage';
import { auth, storage } from '../../../firebase';

export const PhotosGallery = ({ data }: DataType) => {
  const maxItems: number = 20;
  const nextPage = query(photosCollectionRef(), orderBy('timeCreated', 'desc'), limit(maxItems));
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  const user = auth?.currentUser;

  
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
      <em className={styles.title}>{data?.Account?.gallery?.userPhotosTitle}</em>

      <Wrapper>
        {
          userPhotos.length > 0 ?
            userPhotos.map(({ fileUrl, description, time }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
            >
            <Article
              imgLink={fileUrl}
              refFile={photosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${user?.uid}/photos/${description}`)}
              imgDescription={description} />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.photos} />
        }
      </Wrapper>
    </article>
  );
};
