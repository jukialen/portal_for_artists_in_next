import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, storage } from '../../firebase';
import {
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where
} from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { Button } from '@chakra-ui/react';

import { FileType } from 'types/global.types';

import { allPhotosCollectionRef, user, userPhotosRef } from 'references/referencesFirebase';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import { filesElements } from 'helpers/fileElements';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';

import styles from './index.module.scss';

export default function Drawings() {
  const router = useRouter();
  const { pid } = router.query;
  const loading = useCurrentUser('/');
  const data = useHookSWR();
  
  const maxItems: number = 30;
  
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);
  
  let firstPage: Query;
  const currentUser = auth?.currentUser;
  
  const downloadDrawings = async () => {
    try {
      firstPage = query(allPhotosCollectionRef(),
        where('tag', '==', pid),
        orderBy('timeCreated', 'desc'),
        limit(maxItems)
      );
      
      const drawingsArray: FileType[] = [];
      
      const documentSnapshots = await getDocs(firstPage);
     
      for (const document of documentSnapshots.docs) {
        const docSnap = await getDoc(user(document.data().uid));
        
        if (docSnap.exists()) {
          filesElements(drawingsArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No such drawings');
        }
        setUserDrawings(drawingsArray);
      }
      console.log(drawingsArray);
      drawingsArray.length === 30 && setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      
    } catch (e) {
      console.error(e);
      console.log('No such drawings!');
    }
  };
  
  useEffect(() => {
    !!pid && downloadDrawings();
  }, [pid]);
  
  const nextElements = async () => {
    try {
      const nextPage: Query = query(allPhotosCollectionRef(),
        where('tag', 'in', pid),
        orderBy('timeCreated', 'desc'),
        limit(maxItems),
        startAfter(lastVisible),
      );
      
      const documentSnapshots = await getDocs(nextPage);
      
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      
      const nextArray: FileType[] = [];
      
      for (const document of documentSnapshots.docs) {
        const docSnap = await getDoc(user(document.data().uid));
        
        if (docSnap.exists()) {
          filesElements(nextArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No more drawings');
        }
        
        setUserDrawings(nextArray.concat(...nextArray));
        setI(++i);
      }
      console.log(userDrawings);
    } catch (e) {
      console.error(e);
    }
  };
  
  if (loading) {
    return null;
  }
  
  return <>
    <HeadCom path={router.asPath} content='Sites with drawings and photos.' />
    
    <em className={styles.title}>{data?.Aside?.category}: {pid}</em>
    
    <Wrapper>
      {
        userDrawings.length > 0 ?
          userDrawings.map(({ fileUrl, time, description, pseudonym, tags, uid, idPost }: FileType, index) =>
            <Article
              key={index}
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={userPhotosRef(currentUser?.uid!)}
              subCollection='photos'
              refStorage={ref(storage, `${currentUser?.uid}/photos/${description}`)}
              tag={tags}
              uid={uid}
              idPost={idPost}
            />) : <ZeroFiles text={data?.ZeroFiles?.files} />
      }
      
      {
        !!lastVisible && userDrawings.length === 30 * i &&
        <Button
          className={styles.nextButton}
          variant='outline'
          colorScheme='blue'
          width='8rem'
          borderColor='#4F8DFF'
          _hover={{ backgroundColor: '#4F8DFF' }}
          onClick={nextElements}
        >
          {data?.Groups?.list?.more}
        </Button>
      }
    </Wrapper>
  </>;
};