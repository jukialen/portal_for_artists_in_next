import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  CollectionReference,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  where
} from 'firebase/firestore';
import { FileType } from 'types/global.types';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';
import {
  allAnimatedCollectionRef,
  allPhotosCollectionRef,
  allVideosCollectionRef, animationsCollectionRef, photosCollectionRef, videosCollectionRef
} from 'references/referencesFirebase';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

import styles from './categories_index.module.scss';
import { Skeleton } from '@chakra-ui/react';
import { auth, db, storage } from '../firebase';
import { ref, StorageReference } from 'firebase/storage';
import { Wrapper } from '../components/atoms/Wrapper/Wrapper';

export default function Drawings() {
  const router = useRouter();
  const { index } = router.query;
  const loading = useCurrentUser('/');
  
  const maxItems: number = 10;
  const user = auth?.currentUser;
  
  const data = useHookSWR();
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [nextPage, setNextPage] = useState<Query>();
  const [refFile, setRefFile] = useState<CollectionReference>();
  const [refStorage, setRefStorage] = useState<StorageReference>();
  const [subCollection, setSubCollection] = useState('');
  
  
  useEffect(() => {
    switch (index) {
      case 'photographs':
        setNextPage(query(allPhotosCollectionRef(),
          where('tag', 'in', ['Fotografie', 'Photographs', '写真']),
          orderBy('timeCreated', 'desc'),
          limit(maxItems)
        ));
        break;
      case 'animations':
        setNextPage(query(allAnimatedCollectionRef(),
          where('tag', 'in', ['Animacje', 'Animations', 'アニメーション']),
          orderBy('timeCreated', 'desc'),
          limit(maxItems)
        ));
        break;
      case 'videos':
        setNextPage(query(allVideosCollectionRef(),
          where('tag', 'in', ['Filmy', 'Videos', '映画']),
          orderBy('timeCreated', 'desc'),
          limit(maxItems)
        ));
        break;
      case 'others':
        setNextPage(query(allPhotosCollectionRef(),
          where('tag', 'in', ['Inne', 'Others', '他']),
          orderBy('timeCreated', 'desc'),
          limit(maxItems)
        ));
        break;
    }
  }, [index]);
  
  console.log('as', index);
  
  const downloadDrawings = async () => {
    try {
      onSnapshot(nextPage!, (querySnapshot) => {
          const filesArray: FileType[] = [];
    
          querySnapshot.forEach(async (document: QueryDocumentSnapshot) => {
            const docRef = doc(db, `users/${document.data().uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              filesArray.push({
                fileUrl: document.data().fileUrl,
                time: document.data().timeCreated,
                tags: document.data().tag,
                pseudonym: docSnap.data().pseudonym,
                description: document.data().description
              });
              setUserDrawings(filesArray);
              setLoadingFiles(true);
              switch (index) {
                case 'photographs':
                  setRefFile(photosCollectionRef());
                  setSubCollection('photos');
                  setRefStorage(ref(storage, `${user?.uid}/photos/${document.data().description}`));
                  break;
                case 'animations':
                  setRefFile(animationsCollectionRef);
                  setSubCollection('animations');
                  setRefStorage(ref(storage, `${user?.uid}/animations/${document.data().description}`));
                  break;
                case 'videos':
                  setRefFile(videosCollectionRef);
                  setRefStorage(ref(storage, `${user?.uid}/videos/${document.data().description}`));
                  break;
                case 'others':
                  setRefFile(photosCollectionRef);
                  setSubCollection('photos');
                  setRefStorage(ref(storage, `${user?.uid}/photos/${document.data().description}`));
                  break;
              }
            } else {
              console.error('No such doc', docSnap.data(), document.data().uid)
            }
          });
        },
        (e: Error) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.error('Error', e)
      console.error('No such document!');
    }
  };
  
  useEffect(() => { downloadDrawings()  }, [nextPage]);
  
  return !loading ? (
    <div className='workspace'>
      <article className={styles.categories__index__in__account}>
        
        <HeadCom path={router.asPath} content={`Sites with ${index}`} />
        
        <em className={styles.title}>{data?.Aside?.category}: {index}</em>
        
        <Wrapper>{
          userDrawings.length > 0 ? userDrawings.map(({ fileUrl, time, description, pseudonym }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            {
              index === 'videos' ?
                <Videos
                  link={fileUrl}
                  authorName={pseudonym}
                  refFile={videosCollectionRef()}
                  refStorage={ref(storage, `${user?.uid}/videos/${description}`)}
                /> :
                <Article
                  imgLink={fileUrl}
                  imgDescription={description}
                  authorName={pseudonym}
                  unopt={index === 'animations'}
                  refFile={refFile!}
                  subCollection={subCollection}
                  refStorage={refStorage!}
                />
            }
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.videos} />
        }</Wrapper>
      </article>
    </div>
  ) : null;
};