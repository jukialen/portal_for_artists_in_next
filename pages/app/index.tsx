import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, storage } from '../../firebase';
import { getDoc, getDocs } from 'firebase/firestore';
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

export default function Application() {
  const { asPath } = useRouter();
  
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [userAnimations, setUserAnimations] = useState<FileType[]>([]);
  const [userVideos, setUserVideos] = useState<FileType[]>([]);
  const [userOthers, setUserOthers] = useState<FileType[]>([]);
  
  const currentUser = auth?.currentUser?.uid;
  
  const downloadDrawings = async () => {
    try {
      const querySnapshot = await getDocs(nextDrawings);
      const filesArray: FileType[] = [];
      
      for (const document of querySnapshot.docs) {
        const docSnap = await getDoc(user(document.data().uid));
        
        if (docSnap.exists()) {
          filesElements(filesArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No such drawings');
        }
      }
      
      setUserDrawings(filesArray);
    } catch (e) {
      console.error('Error', e)
      console.error('No such drawings!');
    }
  };
  
  const downloadPhotos = async () => {
    try {
      const querySnapshot = await getDocs(nextPhotos);
      const filesArray: FileType[] = [];
      
      for (const document of querySnapshot.docs) {
        const docSnap = await getDoc(user(document.data().uid));
        
        if (docSnap.exists()) {
          filesElements(filesArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No such photos');
        }
      }
      
      setUserPhotos(filesArray);
    } catch (e) {
      console.error('Error', e)
      console.error('No such photos!');
    }
  };
  
  const downloadAnimations = async () => {
    try {
      const querySnapshot = await getDocs(nextAnimations);
      const filesArray: FileType[] = [];
      
      for (const document of querySnapshot.docs) {
        const docSnap = await getDoc(user(document.data().uid));
        
        if (docSnap.exists()) {
          filesElements(filesArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No such animations');
        }
      }
      
      setUserAnimations(filesArray);
    } catch (e) {
      console.error('Error', e)
      console.error('No such animations!');
    }
  };
  
  const downloadVideos = async () => {
    try {
      const querySnapshot = await getDocs(nextVideos);
      const filesArray: FileType[] = [];
      
      for (const document of querySnapshot.docs) {
        const docSnap = await getDoc(user(document.data().uid));
        
        if (docSnap.exists()) {
          filesElements(filesArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No such videos');
        }
      }
      
      setUserVideos(filesArray);
    } catch (e) {
      console.error('Error', e)
      console.error('No such videos!');
    }
  };
  
  const downloadOthers = async () => {
    try {
      const querySnapshot = await getDocs(nextOthers);
      const filesArray: FileType[] = [];
  
      for (const document of querySnapshot.docs) {
        const docSnap = await getDoc(user(document.data().uid));
    
        if (docSnap.exists()) {
          filesElements(filesArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No such others');
        }
      }
  
      setUserOthers(filesArray);
    } catch (e) {
      console.error('Error', e);
      console.error('No such others!');
    }
  };
  
  useEffect(() => {
    !!nextDrawings && downloadDrawings();
  }, [nextDrawings]);
  useEffect(() => {
    !!nextPhotos && downloadPhotos();
  }, [nextPhotos]);
  useEffect(() => {
    !!nextAnimations && downloadAnimations();
  }, [nextAnimations]);
  useEffect(() => {
    !!nextVideos && downloadVideos();
  }, [nextVideos]);
  useEffect(() => {
    !!nextOthers && downloadOthers();
  }, [nextOthers]);
  
  if (loading) {
    return null;
  }
  
  return <>
    <HeadCom path={asPath} content='Main site for logged in users.' />
    
    <h2 className={styles.top__among__users}>{data?.App?.lastDrawings}</h2>
    <AppWrapper>
      {
        !!nextDrawings && userDrawings.length > 0 ? userDrawings.map(({
          fileUrl,
          time,
          description,
          pseudonym,
          tags,
          uid,
          idPost
        }: FileType, index) =>
          <Article
            key={index}
            link={fileUrl}
            description={description}
            authorName={pseudonym}
            refFile={allPhotosCollectionRef()}
            subCollection='photos'
            refStorage={ref(storage, `${currentUser}/photos/${description}`)}
            tag={tags}
            uid={uid}
            idPost={idPost}
          />) : <ZeroFiles text={data?.ZeroFiles?.drawings} />
        }
      </AppWrapper>
  
      <h2 className={styles.top__among__users}>{data?.App?.lastPhotos}</h2>
      <AppWrapper>
        {
          userPhotos.length > 0 ? userPhotos.map(({ fileUrl, time, description, pseudonym, tags, uid, idPost }: FileType, index) =>
              <Article
                key={index}
                link={fileUrl}
                description={description}
                authorName={pseudonym}
                refFile={allPhotosCollectionRef()}
                subCollection='photos'
                refStorage={ref(storage, `${currentUser}/photos/${description}`)}
                tag={tags}
                uid={uid}
                idPost={idPost}
              />) : <ZeroFiles text={data?.ZeroFiles?.photos} />
        }
      </AppWrapper>
  
      <h2 className={styles.top__among__users}>{data?.App?.lastOthers}</h2>
      <AppWrapper>
        {
          userOthers.length > 0 ? userOthers.map(({
            fileUrl,
            time,
            description,
            pseudonym,
            tags,
            uid,
            idPost
          }: FileType, index) =>
            <Article
              key={index}
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allPhotosCollectionRef()}
              subCollection='photos'
              refStorage={ref(storage, `${currentUser}/photos/${description}`)}
              tag={tags}
              uid={uid}
              idPost={idPost}
            />) : <ZeroFiles text={data?.ZeroFiles?.others} />
        }
      </AppWrapper>
      
      <h2 className={styles.top__among__users}>{data?.App?.lastAnimations}</h2>
      <AppWrapper>
        {
          userAnimations.length > 0 ? userAnimations.map(({
            fileUrl,
            time,
            description,
            pseudonym,
            tags,
            uid,
            idPost
          }: FileType, index) =>
            <Article
              key={index}
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
            />) : <ZeroFiles text={data?.ZeroFiles?.animations} />
        }
      </AppWrapper>
      <h2 className={styles.liked}>{data?.App?.lastVideos}</h2>
      <AppWrapper>
        {
          userVideos.length > 0 ? userVideos.map(({
            fileUrl,
            time,
            description,
            pseudonym,
            tags,
            uid,
            idPost
          }: FileType, index) =>
            <Videos
              key={index}
              link={fileUrl}
              description={description}
              authorName={pseudonym}
              refFile={allVideosCollectionRef()}
              refStorage={ref(storage, `${currentUser}/videos/${description}`)}
              tag={tags}
              uid={uid}
              idPost={idPost}
            />) : <ZeroFiles text={data?.ZeroFiles?.videos} />
        }
      </AppWrapper>
    </>
};