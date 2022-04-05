import { useEffect, useState } from 'react';
import { storage } from '../../../firebase';
import { ref } from 'firebase/storage';
import { limit, onSnapshot, orderBy, query } from 'firebase/firestore';

import { animationsCollectionRef, userAnimationsRef} from 'references/referencesFirebase';

import { FileType, UserType } from 'types/global.types';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';

import { Skeleton } from '@chakra-ui/react';

export const AnimatedGallery = ({ user, data }: UserType) => {
  const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const maxItems: number = 15;
  const nextPage = query(
    !!user ? userAnimationsRef(user) : animationsCollectionRef(),
    orderBy('timeCreated', 'desc'),
    limit(maxItems)
  );
  
  const downloadAnimations = () => {
    try {
      onSnapshot(nextPage, (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach((doc) => {
            filesArray.push({
              fileUrl: doc.data().fileUrl,
              description: doc.data().description,
              time: doc.data().timeCreated,
              tags: doc.data().tag
            });
          });
          setUserAnimatedPhotos(filesArray);
          setLoading(true)
        },
        (e) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.log('No such document!', e);
    }
  };
  
  useEffect(() => {
    return downloadAnimations();
  }, []);
  
  return (
    <article id='user__gallery__in__account' className='user__gallery__in__account'>
      <em className='title'>{data?.Account?.gallery?.userAnimationsTitle}</em>
      
      <Wrapper>
        {
          userAnimatedPhotos.length > 0 ?
            userAnimatedPhotos.map(({ fileUrl, description, time, tags }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
            >
              <Article
                link={fileUrl}
                refFile={animationsCollectionRef()}
                subCollection='animations'
                refStorage={ref(storage, `${user}/animations/${description}`)}
                description={description}
                tag={tags}
                unopt
              />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.animations} />
        }
      </Wrapper>
    </article>
  );
};