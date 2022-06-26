import { useEffect, useState } from 'react';
import { db, storage } from '../../../firebase';
import { ref } from 'firebase/storage';
import { doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';

import { userAnimationsRef } from 'references/referencesFirebase';

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
    userAnimationsRef(user),
    orderBy('timeCreated', 'desc'),
    limit(maxItems)
  );
  
  const downloadAnimations = () => {
    try {
      onSnapshot(nextPage, (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach(async (document) => {
            const docRef = doc(db, `users/${document.data().uid}`);
            const docSnap = await getDoc(docRef);
            filesArray.push({
              fileUrl: document.data().fileUrl,
              description: document.data().description,
              time: document.data().timeCreated,
              pseudonym: docSnap.data()!.pseudonym,
              tags: document.data().tag
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
                refFile={userAnimationsRef()}
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