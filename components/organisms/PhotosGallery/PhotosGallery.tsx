import { useEffect, useState } from 'react';
import { storage } from '../../../firebase';
import { ref } from 'firebase/storage';
import { limit, onSnapshot, orderBy, query, } from 'firebase/firestore';

import { photosCollectionRef, userPhotosRef } from 'references/referencesFirebase';

import { FileType, UserType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';

import { Skeleton } from '@chakra-ui/react';

export const PhotosGallery = ({ user, data }: UserType) => {
  const maxItems: number = 20;
  const nextPage = query(!!user ? userPhotosRef(user) : photosCollectionRef(), orderBy('timeCreated', 'desc'), limit(maxItems));
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const downloadFiles = () => {
    try {
      onSnapshot(nextPage,  (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach((doc) => {
            filesArray.push({
              fileUrl: doc.data().fileUrl,
              description: doc.data().description,
              time: doc.data().timeCreated,
              tags: doc.data().tag
            });
          });
          setUserPhotos(filesArray);
          setLoading(true);
        },
        (e) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    return downloadFiles();
  }, []);
  
  return (
    <article id='user__gallery__in__account' className='user__gallery__in__account'>
      <em className='title'>{data?.Account?.gallery?.userPhotosTitle}</em>

      <Wrapper>
        {
          userPhotos.length > 0 ?
            userPhotos.map(({ fileUrl, description, time, tags }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
            >
            <Article
              link={fileUrl}
              refFile={photosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${user}/photos/${description}`)}
              description={description}
              tag={tags}
            />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.photos} />
        }
      </Wrapper>
    </article>
  );
};
