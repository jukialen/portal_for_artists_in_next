import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import {
  doc, getDoc,
  onSnapshot,
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
  
  const downloadDrawings = () => {
    try {
      onSnapshot(nextDrawings, (querySnapshot) => {
        const filesArray: FileType[] = [];
  
        querySnapshot.forEach(async (document) => {
          const docRef = doc(db, `users/${document.data().uid}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            filesElements(filesArray, document, docSnap.data().pseudonym);
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
  
  const downloadPhotos = () => {
    try {
      onSnapshot(nextPhotos, (querySnapshot) => {
          const filesArray: FileType[] = [];
    
          querySnapshot.forEach(async (document) => {
          const docRef = doc(db, `users/${document.data().uid}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            filesElements(filesArray, document, docSnap.data().pseudonym);
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
  
  const downloadAnimations = () => {
    try {
      onSnapshot(nextAnimations, (querySnapshot) => {
          const filesArray: FileType[] = [];
          querySnapshot.forEach(async (document) => {
            const docRef = doc(db, `users/${document.data().uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              filesElements(filesArray, document, docSnap.data().pseudonym);
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
  
  const downloadVideos = () => {
    try {
      onSnapshot(nextVideos, (querySnapshot) => {
          const filesArray: FileType[] = [];
    
          querySnapshot.forEach(async (document) => {
            const docRef = doc(db, `users/${document.data().uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              filesElements(filesArray, document, docSnap.data().pseudonym);
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
  
  const downloadOthers = () => {
    try {
      onSnapshot(nextOthers, (querySnapshot) => {
          const filesArray: FileType[] = [];
          
          querySnapshot.forEach(async (document) => {
          const docRef = doc(db, `users/${document.data().uid}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            filesElements(filesArray, document, docSnap.data().pseudonym);
          } else {
            console.error('No such doc')
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
  
  useMemo(() => { downloadDrawings() }, []);
  useMemo(() => { downloadPhotos() }, []);
  useMemo(() => { downloadOthers() }, []);
  useMemo(() => { downloadAnimations() }, []);
  useMemo(() => {downloadVideos() }, []);
  
  return !loading ? (
    <>
      <HeadCom path={asPath} content='Main site for logged in users.' />
  
      <h2 className={styles.top__among__users}>{data?.App?.lastDrawings}</h2>
      <AppWrapper>
        {
          userDrawings.length > 0 ? userDrawings.map(({ fileUrl, time, description, pseudonym, tags }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Article
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allPhotosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${user?.uid}/photos/${description}`)}
              tag={tags}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.drawings} />
        }
      </AppWrapper>
  
      <h2 className={styles.top__among__users}>{data?.App?.lastPhotos}</h2>
      <AppWrapper>
        {
          userPhotos.length > 0 ? userPhotos.map(({ fileUrl, time, description, pseudonym, tags }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Article
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allPhotosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${user?.uid}/photos/${description}`)}
              tag={tags}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.photos} />
        }
      </AppWrapper>
  
      <h2 className={styles.top__among__users}>{data?.App?.lastOthers}</h2>
      <AppWrapper>
        {
          userOthers.length > 0 ? userOthers.map(({ fileUrl, time, description, pseudonym, tags }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Article
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allPhotosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${user?.uid}/photos/${description}`)}
              tag={tags}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.others} />
        }
      </AppWrapper>
      
      <h2 className={styles.top__among__users}>{data?.App?.lastAnimations}</h2>
      <AppWrapper>
        {
          userAnimations.length > 0 ? userAnimations.map(({ fileUrl, time, description, pseudonym, tags }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Article
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allAnimatedCollectionRef()}
              unopt
              subCollection='animations'
              refStorage={ref(storage, `${user?.uid}/animations/${description}`)}
              tag={tags}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.animations} />
        }
      </AppWrapper>
      <h2 className={styles.liked}>{data?.App?.lastVideos}</h2>
      <AppWrapper>
        {
          userVideos.length > 0 ? userVideos.map(({ fileUrl, time, description, pseudonym, tags }: FileType) => <Skeleton
            isLoaded={loadingFiles}
            key={time}
          >
            <Videos
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allVideosCollectionRef()}
              refStorage={ref(storage, `${user?.uid}/videos/${description}`)}
              tag={tags}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.videos} />
        }
      </AppWrapper>
    </>
  ) : null;
};