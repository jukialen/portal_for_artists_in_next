import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import {
  doc, getDoc,
  onSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { ref } from 'firebase/storage';

import { FileType } from 'types/global.types';

import { filesElements } from 'helpers/fileElements';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import {
  allPhotosCollectionRef,
  allAnimatedCollectionRef,
  allVideosCollectionRef,
  nextDrawings,
  nextPhotos,
  nextAnimations,
  nextVideos,
  nextOthers
} from 'references/referencesFirebase';

import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AppWrapper } from 'components/atoms/AppWrapper/AppWrapper';

import styles from './index.module.scss';
import { Skeleton } from '@chakra-ui/react';

export default function Application() {
  const { asPath } = useRouter();
  
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [userAnimations, setUserAnimations] = useState<FileType[]>([]);
  const [userVideos, setUserVideos] = useState<FileType[]>([]);
  const [userOthers, setUserOthers] = useState<FileType[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  
  const user = auth?.currentUser;
  
  const downloadDrawings = async () => {
    try {
      onSnapshot(nextDrawings, (querySnapshot) => {
        const filesArray: FileType[] = [];
  
        querySnapshot.forEach(async (document: QueryDocumentSnapshot) => {
          const docRef = doc(db, `users/${document.data().uid}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            await filesElements(filesArray, document, docSnap);
          } else {
            console.error('No such doc')
          }
        });
        
        setUserDrawings(filesArray);
        setLoadingFiles(true);
        },
        (e) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.error('Error', e)
      console.error('No such document!');
    }
  };
  
  const downloadPhotos = async () => {
    try {
      onSnapshot(nextPhotos, (querySnapshot) => {
          const filesArray: FileType[] = [];
    
          querySnapshot.forEach(async (document: QueryDocumentSnapshot) => {
          const docRef = doc(db, `users/${document.data().uid}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            await filesElements(filesArray, document, docSnap);
          } else {
            console.error('No such doc')
          }
        });
        
        setUserPhotos(filesArray);
        setLoadingFiles(true);
        },
        (e) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.error('Error', e)
      console.error('No such document!');
    }
  };
  
  const downloadAnimations = async () => {
    try {
      onSnapshot(nextAnimations, (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach(async (document: QueryDocumentSnapshot) => {
            const docRef = doc(db, `users/${document.data().uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              await filesElements(filesArray, document, docSnap);
            } else {
              console.error('No such doc')
            }
          });
          
          setUserAnimations(filesArray);
          setLoadingFiles(true);
        },
        (e) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.error('Error', e)
      console.error('No such document!');
    }
  };
  
  const downloadVideos = async () => {
    try {
      onSnapshot(nextVideos, (querySnapshot) => {
          const filesArray: FileType[] = [];
    
          querySnapshot.forEach(async (document: QueryDocumentSnapshot) => {
            const docRef = doc(db, `users/${document.data().uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              await filesElements(filesArray, document, docSnap);
            } else {
              console.error('No such doc')
            }
          });
          
          setUserVideos(filesArray);
          setLoadingFiles(true);
          },
        (e) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.error('Error', e)
      console.error('No such document!');
    }
  };
  
  const downloadOthers = async () => {
    try {
      onSnapshot(nextOthers, (querySnapshot) => {
          const filesArray: FileType[] = [];
          
          querySnapshot.forEach(async (document: QueryDocumentSnapshot) => {
          const docRef = doc(db, `users/${document.data().uid}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            await filesElements(filesArray, document, docSnap);
          } else {
            console.error('No such doc', docSnap.data(), document.data().uid)
          }
          });
          
          setUserOthers(filesArray);
          setLoadingFiles(true);
        },
        (e: Error) => {
          console.error('Error', e);
        });
    } catch (e) {
      console.error('Error', e)
      console.error('No such document!');
    }
  };
  
  useEffect(() => { downloadDrawings() }, []);
  useEffect(() => { downloadPhotos() }, []);
  useEffect(() => { downloadOthers() }, []);
  console.log('ph', userDrawings)
  useEffect(() => { downloadAnimations() }, []);
  console.log('ani', userAnimations)
  useEffect(() => {downloadVideos() }, []);
  console.log('vi', userVideos)
  
  return !loading ? (
    <section className='workspace'>
      <HeadCom path={asPath} content='Main site for logged in users.' />
  
      <h2 className={styles.top__among__users}>{data?.App?.lastDrawings}</h2>
      <AppWrapper>
        {
          userDrawings.length > 0 ? userDrawings.map(({ fileUrl, time, description, pseudonym }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Article
              imgLink={fileUrl}
              imgDescription={description}
              authorName={pseudonym}
              refFile={allPhotosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${user?.uid}/photos/${description}`)}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.drawings} />
        }
      </AppWrapper>
  
      <h2 className={styles.top__among__users}>{data?.App?.lastPhotos}</h2>
      <AppWrapper>
        {
          userPhotos.length > 0 ? userPhotos.map(({ fileUrl, time, description, pseudonym }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Article
              imgLink={fileUrl}
              imgDescription={description}
              authorName={pseudonym}
              refFile={allPhotosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${user?.uid}/photos/${description}`)}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.photos} />
        }
      </AppWrapper>
  
      <h2 className={styles.top__among__users}>{data?.App?.lastOthers}</h2>
      <AppWrapper>
        {
          userOthers.length > 0 ? userOthers.map(({ fileUrl, time, description, pseudonym }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Article
              imgLink={fileUrl}
              imgDescription={description}
              authorName={pseudonym}
              refFile={allPhotosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${user?.uid}/photos/${description}`)}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.others} />
        }
      </AppWrapper>
      
      <h2 className={styles.top__among__users}>{data?.App?.lastAnimations}</h2>
      <AppWrapper>
        {
          userAnimations.length > 0 ? userAnimations.map(({ fileUrl, time, description, pseudonym }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Article
              imgLink={fileUrl}
              imgDescription={description}
              authorName={pseudonym}
              refFile={allAnimatedCollectionRef()}
              unopt
              subCollection='animations'
              refStorage={ref(storage, `${user?.uid}/animations/${description}`)}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.animations} />
        }
        
      </AppWrapper>
      <h2 className={styles.liked}>{data?.App?.lastVideos}</h2>
      <AppWrapper>
        {
          userVideos.length > 0 ? userVideos.map(({ fileUrl, time, description, pseudonym }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Videos
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allVideosCollectionRef()}
              refStorage={ref(storage, `${user?.uid}/videos/${description}`)}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.videos} />
        }

      </AppWrapper>
    </section>
  ) : null;
};