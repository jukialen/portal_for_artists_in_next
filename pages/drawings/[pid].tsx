import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db, storage } from '../../firebase';
import { doc, getDoc, limit, onSnapshot, orderBy, Query, query, where } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { Skeleton } from '@chakra-ui/react';

import { FileType } from 'types/global.types';

import { allPhotosCollectionRef, userPhotosRef } from 'references/referencesFirebase';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';

import styles from './index.module.scss';

export default function Drawings() {
  const router = useRouter();
  const { pid } = router.query;
  const loading = useCurrentUser('/');
  
  const maxItems: number = 10;
  
  const data = useHookSWR();
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [nextPageArray, setNextPageArray] = useState<string[]>([]);
  
  let nextPage: Query;
  const user = auth?.currentUser;
  
  useEffect(() => {
    switch (pid) {
      case 'realistic':
        setNextPageArray(['Realistyczne', 'Realistic', '写実的']);
        break;
      case 'manga':
        setNextPageArray(['Manga', 'マンガ']);
        break;
      case 'anime':
        setNextPageArray(['Anime', 'アニメ']);
        break;
      case 'comics':
        setNextPageArray(['Komiksy', 'Comics', 'コミック']);
        break;
    }
  }, [pid]);
  
  const downloadDrawings = () => {
    try {
      nextPage = query(allPhotosCollectionRef(),
        where('tag', 'in', nextPageArray),
        orderBy('timeCreated', 'desc'),
        limit(maxItems)
      );
  
      onSnapshot(nextPage, (querySnapshot) => {
          const drawingsArray: FileType[] = [];
    
          querySnapshot.forEach(async (document) => {
            const docRef = doc(db, `users/${document.data().uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              drawingsArray.push({
                fileUrl: document.data().fileUrl,
                time: document.data().timeCreated,
                tags: document.data().tag,
                pseudonym: docSnap.data()!.pseudonym,
                description: document.data().description,
                uid: document.data().uid,
                idPost: document.id
              });
            } else {
              console.error('No such doc');
            }
          });
          
          setUserDrawings(drawingsArray);
          setLoadingFiles(true);
        },
        (e) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.log(e);
      console.log('No such document!');
    }
  };
  
  useMemo(() => {
    return downloadDrawings();
  }, [nextPageArray]);
  
  return !loading ? (
    <>
      <HeadCom path={router.asPath} content='Sites with drawings and photos.' />
      
        <em className={styles.title}>{data?.Aside?.category}: {pid}</em>
  
        <Wrapper>{
          userDrawings.length > 0 ?
            userDrawings.map(({ fileUrl, time, description, pseudonym, tags, uid, idPost }: FileType) => <Skeleton
              isLoaded={loadingFiles}
              key={time}
            >
              <Article
                link={fileUrl}
                description={description}
                authorName={pseudonym}
                refFile={userPhotosRef(user?.uid!)}
                subCollection='photos'
                refStorage={ref(storage, `${user?.uid}/photos/${description}`)}
                tag={tags}
                uid={uid}
                idPost={idPost}
              />
            </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.files} />
       }</Wrapper>
    </>
  ) : null;
};