import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db, storage } from '../../../firebase';
import { ref } from 'firebase/storage';
import { doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Skeleton } from '@chakra-ui/react';

import { userAnimationsRef } from 'references/referencesFirebase';

import { FileType, UserType } from 'types/global.types';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';

export const AnimatedGallery = ({ user, pseudonym, data }: UserType) => {
  const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { asPath } = useRouter();
  
  const maxItems: number = 15;
  const nextPage = query(
    userAnimationsRef(user!),
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
              tags: document.data().tag,
              uid: document.data().uid,
              idPost: document.id
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
     downloadAnimations();
  }, []);
  
  return (
    <article id='user__gallery__in__account' className='user__gallery__in__account'>
      {decodeURIComponent(asPath) === `/account/${pseudonym}` && <em className='title'>{data?.Account?.gallery?.userAnimationsTitle}</em>}
      {console.log(userAnimatedPhotos)}
      <Wrapper>
        {
          userAnimatedPhotos.length > 0 ?
            userAnimatedPhotos.map(({ fileUrl, description, time, tags, uid, idPost }: FileType, index) => <Skeleton
              isLoaded={loading}
              key={index}
            >
              <Article
                link={fileUrl}
                refFile={userAnimationsRef(user!)}
                subCollection='animations'
                refStorage={ref(storage, `${user}/animations/${description}`)}
                description={description}
                tag={tags}
                unopt
                uid={uid}
                idPost={idPost}
              />
            </Skeleton>) :
            <ZeroFiles text={data?.ZeroFiles?.animations} />
        }
      </Wrapper>
    </article>
  );
};