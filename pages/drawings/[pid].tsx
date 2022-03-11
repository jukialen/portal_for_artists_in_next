import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { limit, onSnapshot, orderBy, Query, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { FileType } from 'types/global.types';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';
import { allPhotosCollectionRef } from 'references/referencesFirebase';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';

import styles from './index.module.scss';
import { Skeleton } from '@chakra-ui/react';
import { Article } from 'components/molecules/Article/Article';

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
  
  const downloadDrawings = async () => {
    try {
      nextPage = query(allPhotosCollectionRef(),
        where('tag', 'in', nextPageArray),
        orderBy('timeCreated', 'desc'),
        limit(maxItems)
      );
  
      onSnapshot(nextPage, (querySnapshot) => {
          const drawingsArray: FileType[] = [];
      
          console.log(pid);
          console.log('f2', nextPage);
      
          querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
            drawingsArray.push({
              fileUrl: doc.data().fileUrl,
              time: doc.data().timeCreated,
              tags: doc.data().tag,
              description: doc.data().description
            });
          });
          console.log('array', drawingsArray);
          setUserDrawings(drawingsArray);
          setLoadingFiles(true);
        },
        (e: Error) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.log('No such document!');
    }
  };
  
  useEffect(() => {
    downloadDrawings();
  }, [nextPageArray]);
  
  return !loading ? (
    <div className='workspace'>
      <article id='user__gallery__in__account' className={styles.user__gallery__in__account}>
  
      <HeadCom path={router.asPath} content='Sites with drawings and photos.' />
      
      <em className={styles.title}>{data?.Aside?.category}: {pid}</em>
      
        <div className={styles.user__drawings}>{
          userDrawings !== [] ? userDrawings.map(({ fileUrl, time, description }: FileType) => <Skeleton
              isLoaded={loadingFiles}
              key={time}
            >
            <Article imgLink={fileUrl} imgDescription={description} />
            </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.videos} />
        }</div>
      </article>
    </div>
  ) : null;
};