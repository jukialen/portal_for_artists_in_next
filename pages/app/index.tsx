import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { auth, storage } from '../../firebase';
import { getDoc, onSnapshot, } from 'firebase/firestore';
import { ref } from 'firebase/storage';

import { FileType } from 'types/global.types';

import { filesElements } from 'helpers/fileElements';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import {
  allAnimatedCollectionRef,
  allPhotosCollectionRef,
  allVideosCollectionRef,
  nextAnimations,
  nextDrawings,
  nextOthers,
  nextPhotos,
  nextVideos,
  user
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
  
  const currentUser = auth?.currentUser?.uid;
  
  const downloadDrawings = () => {
    try {
      onSnapshot(nextDrawings,(querySnapshot) => {
        const filesArray: FileType[] = [];
        
        querySnapshot.forEach(async (document) => {
          const docSnap = await getDoc(user(document.data().uid));
          
          if (docSnap.exists()) {
            filesElements(filesArray, document, docSnap.data().pseudonym);
          } else {
            console.error('No such drawings')
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
      console.error('No such drawings!');
    }
  };
  
  const downloadPhotos = () => {
    try {
      onSnapshot(nextPhotos, (querySnapshot) => {
        const filesArray: FileType[] = [];
    
        querySnapshot.forEach(async (document) => {
          const docSnap = await getDoc(user(document.data().uid));

        if (docSnap.exists()) {
          filesElements(filesArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No such photos')
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
      console.error('No such photos!');
    }
  };
  
  const downloadAnimations = () => {
    try {
      onSnapshot(nextAnimations, (querySnapshot) => {
        const filesArray: FileType[] = [];
        
        querySnapshot.forEach(async (document) => {
          const docSnap = await getDoc(user(document.data().uid));

          if (docSnap.exists()) {
            filesElements(filesArray, document, docSnap.data().pseudonym);
          } else {
            console.error('No such animations')
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
      console.error('No such animations!');
    }
  };
  
  const downloadVideos = () => {
    try {
      onSnapshot(nextVideos, (querySnapshot) => {
        const filesArray: FileType[] = [];
  
        querySnapshot.forEach(async (document) => {
          const docSnap = await getDoc(user(document.data().uid));

          if (docSnap.exists()) {
            filesElements(filesArray, document, docSnap.data().pseudonym);
          } else {
            console.error('No such videos')
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
      console.error('No such videos!');
    }
  };
  
  const downloadOthers = () => {
    try {
      onSnapshot(nextOthers, (querySnapshot) => {
        const filesArray: FileType[] = [];
        
        querySnapshot.forEach(async (document) => {
          const docSnap = await getDoc(user(document.data().uid));

        if (docSnap.exists()) {
          filesElements(filesArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No such others')
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
      console.error('No such others!');
    }
  };
  
  useEffect(() => { downloadDrawings() }, []);
  useMemo(() => { downloadPhotos() }, []);
  useMemo(() => { downloadOthers() }, []);
  useMemo(() => { downloadAnimations() }, []);
  useMemo(() => {downloadVideos() }, []);
  
  if (loading) {
    return null;
  };
  
  return <>
      <HeadCom path={asPath} content='Main site for logged in users.' />
  
      <h2 className={styles.top__among__users}>{data?.App?.lastDrawings}</h2>
      <AppWrapper>
        {
          !!nextDrawings && userDrawings.length > 0 ? userDrawings.map(({ fileUrl, time, description, pseudonym, tags, uid, idPost }: FileType, index) => <Skeleton
            isLoaded={loadingFiles}
            key={index}
          >
            <Article
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allPhotosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${currentUser}/photos/${description}`)}
              tag={tags}
              uid={uid}
              idPost={idPost}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.drawings} />
        }
      </AppWrapper>
  
      <h2 className={styles.top__among__users}>{data?.App?.lastPhotos}</h2>
      <AppWrapper>
        {
          userPhotos.length > 0 ? userPhotos.map(({ fileUrl, time, description, pseudonym, tags, uid, idPost }: FileType, index) =>
            <Skeleton
              isLoaded={loadingFiles}
              key={index}
            >
              <Article
                link={fileUrl}
                description={description}
                authorName={pseudonym}
                refFile={allPhotosCollectionRef()}
                subCollection='photos'
                refStorage={ref(storage, `${currentUser}/photos/${description}`)}
                tag={tags}
                uid={uid}
                idPost={idPost}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.photos} />
        }
      </AppWrapper>
  
      <h2 className={styles.top__among__users}>{data?.App?.lastOthers}</h2>
      <AppWrapper>
        {
          userOthers.length > 0 ? userOthers.map(({ fileUrl, time, description, pseudonym, tags, uid, idPost }: FileType, index) => <Skeleton
            isLoaded={loadingFiles}
            key={index}
          >
            <Article
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allPhotosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${currentUser}/photos/${description}`)}
              tag={tags}
              uid={uid}
              idPost={idPost}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.others} />
        }
      </AppWrapper>
      
      <h2 className={styles.top__among__users}>{data?.App?.lastAnimations}</h2>
      <AppWrapper>
        {
          userAnimations.length > 0 ? userAnimations.map(({ fileUrl, time, description, pseudonym, tags, uid, idPost }: FileType, index) => <Skeleton
            isLoaded={loadingFiles}
            key={index}
          >
            <Article
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allAnimatedCollectionRef()}
              unopt
              subCollection='animations'
              refStorage={ref(storage, `${currentUser}/animations/${description}`)}
              tag={tags}
              uid={uid}
              idPost={idPost}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.animations} />
        }
      </AppWrapper>
      <h2 className={styles.liked}>{data?.App?.lastVideos}</h2>
      <AppWrapper>
        {
          userVideos.length > 0 ? userVideos.map(({ fileUrl, time, description, pseudonym, tags, uid, idPost }: FileType, index) => <Skeleton
            isLoaded={loadingFiles}
            key={index}
          >
            <Videos
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allVideosCollectionRef()}
              refStorage={ref(storage, `${currentUser}/videos/${description}`)}
              tag={tags}
              uid={uid}
              idPost={idPost}
            />
          </Skeleton>) : <ZeroFiles text={data?.ZeroFiles?.videos} />
        }
      </AppWrapper>
    </>
};