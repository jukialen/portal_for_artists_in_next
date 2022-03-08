import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  limit,
  onSnapshot,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where
} from 'firebase/firestore';
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
  const [nextPage, setNextPage] =useState<Query>();
  
  useEffect(() => {
    switch (pid) {
      case 'realistic':
        setNextPage(query(allPhotosCollectionRef(),
          where('tag', 'in', ['Realistyczne', 'Realistic', '写実的']),
          orderBy('timeCreated', 'desc'),
          limit(maxItems)
        ));
        break;
      case 'manga':
        setNextPage(query(allPhotosCollectionRef(),
          where('tag', 'in', ['Manga', 'マンガ']),
          orderBy('timeCreated', 'desc'),
          limit(maxItems)
        ));
        break;
      case 'anime':
        setNextPage(query(allPhotosCollectionRef(),
          where('tag', 'in', ['Anime', 'アニメ']),
          orderBy('timeCreated', 'desc'),
          limit(maxItems)
        ));
        break;
      case 'comics':
        setNextPage(query(allPhotosCollectionRef(),
          where('tag', 'in', ['Komiksy', 'Comics', 'コミック']),
          orderBy('timeCreated', 'desc'),
          limit(maxItems)
        ));
        break;
    }
    
    console.log('as', pid);
    
  }, [pid, data?.Aside?.anime, data?.Aside?.comics, data?.Aside?.manga, data?.Aside?.realistic]);
  
  
  const downloadDrawings = async () => {
    try {
      onSnapshot(nextPage!, (querySnapshot: QuerySnapshot) => {
          
          const filesArray: FileType[] = [];
          
          console.log(pid);
          console.log('f2', nextPage);
    
          querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
            filesArray.push({
              fileUrl: doc.data().fileUrl,
              time: doc.data().timeCreated,
              tags: doc.data().tags,
              description: doc.data().description
            });
          });
          console.log('array', filesArray);
          setUserDrawings(filesArray);
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
  }, [nextPage]);
  
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
  
        {/*{!userDrawings && <ZeroFiles text={data?.ZeroFiles?.videos} />}*/}
      </article>
    </div>
  ) : null;
};