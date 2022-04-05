import { useEffect, useState } from 'react';
import { storage } from '../../../firebase';
import { ref } from 'firebase/storage';
import {
  limit,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';

import { videosCollectionRef, userVideosRef } from 'references/referencesFirebase';

import { UserType, FileType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Videos } from 'components/molecules/Videos/Videos';

import { Skeleton } from '@chakra-ui/react';

export const VideoGallery = ({ user, data }: UserType) => {
  const maxItems: number = 10;
  
  const nextPage = query(
    !!user ? userVideosRef(user) : videosCollectionRef(),
    orderBy('timeCreated', 'desc'),
    limit(maxItems)
  );
  
  const [userVideos, setUserVideos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const downloadVideos = () => {
    try {
      onSnapshot(nextPage,  (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach((doc) => {
            filesArray.push({
              fileUrl: doc.data().fileUrl,
              time: doc.data().timeCreated,
              description: doc.data().description,
              tags: doc.data().tag
            });
          });
          setUserVideos(filesArray);
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
    return downloadVideos();
  }, []);
  
  return (
    <article id='user__gallery__in__account' className='user__gallery__in__account'>
      
      <em className='title'>{data?.Account?.gallery?.userVideosTitle}</em>
      
      <Wrapper>
        {
          userVideos.length > 0 ?
            userVideos.map(({ fileUrl, description, time, tags }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
            >
              <Videos
                link={fileUrl}
                refFile={videosCollectionRef()}
                refStorage={ref(storage, `${user}/videos/${description}`)}
                description={description}
                tag={tags}
              />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.videos} />
        }
      </Wrapper>
    </article>
  );
};
