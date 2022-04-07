import { useEffect, useState } from 'react';
import { auth, db, storage } from '../../../firebase';
import { ref } from 'firebase/storage';
import { doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';

import { userPhotosRef } from 'references/referencesFirebase';

import { filesElements } from 'helpers/fileElements';

import { FileType, UserType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';

import { Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const PhotosGallery = ({ user, pseudonym, data }: UserType) => {
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const currenUser = auth.currentUser;
  const maxItems: number = 20;
  const { asPath } = useRouter();
  const nextPage = query(
      userPhotosRef(user),
      orderBy('timeCreated', 'desc'),
      limit(maxItems)
    )
  
  console.log(user)
  console.log(nextPage)
  
  const downloadFiles = () => {
    try {
      onSnapshot(nextPage,  (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach(async (document) => {
            const docRef = doc(db, `users/${document.data().uid}`);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                filesElements(filesArray, document, !!pseudonym ? pseudonym : docSnap.data().pseudonym);
              } else {
                console.error('No such doc')
              }
          });
          setUserPhotos(filesArray);
    
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
  }, [user]);
  
  console.log(userPhotos)
  
  return (
    <article id='user__gallery__in__account' className='user__gallery__in__account'>
      {asPath === `/account/${pseudonym}` && <em className='title'>{data?.Account?.gallery?.userPhotosTitle}</em>}
      
      <Wrapper>
        {
          (!!user && userPhotos.length > 0) ?
            userPhotos.map(({ fileUrl, description, time, tags, pseudonym }: FileType) => <Skeleton
              isLoaded={loading}
              key={time}
            >
            <Article
              link={fileUrl}
              refFile={userPhotosRef()}
              subCollection='photos'
              refStorage={ref(storage, `${user}/photos/${description}`)}
              description={description}
              tag={tags}
              authorName={pseudonym}
            />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.photos} />
        }
      </Wrapper>
    </article>
  );
};
