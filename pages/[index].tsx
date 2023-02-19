import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db, storage } from '../firebase';
import { ref } from 'firebase/storage';
import { doc, getDoc, limit, onSnapshot, orderBy, Query, query, where } from 'firebase/firestore';
import { Skeleton } from '@chakra-ui/react';

import { FileType } from 'types/global.types';

import { filesElements } from 'helpers/fileElements';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import {
  allAnimatedCollectionRef,
  allPhotosCollectionRef,
  allVideosCollectionRef,
  userAnimationsRef,
  userPhotosRef,
  userVideosRef,
} from 'config/referencesFirebase';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

import styles from './categories_index.module.scss';

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

  useEffect(() => {
    switch (index) {
      case 'photographs':
        setNextPage(
          query(
            allPhotosCollectionRef(),
            where('tag', '==', 'photographs'),
            orderBy('timeCreated', 'desc'),
            limit(maxItems),
          ),
        );
        break;
      case 'animations':
        setNextPage(
          query(
            allAnimatedCollectionRef(),
            where('tag', '==', 'animations'),
            orderBy('timeCreated', 'desc'),
            limit(maxItems),
          ),
        );
        break;
      case 'videos':
        setNextPage(
          query(
            allVideosCollectionRef(),
            where('tag', '==', 'videos'),
            orderBy('timeCreated', 'desc'),
            limit(maxItems),
          ),
        );
        break;
      case 'others':
        setNextPage(
          query(
            allPhotosCollectionRef(),
            where('tag', '==', 'others'),
            orderBy('timeCreated', 'desc'),
            limit(maxItems),
          ),
        );
        break;
    }
  }, [index]);

  const downloadDrawings = () => {
    try {
      onSnapshot(
        nextPage!,
        (querySnapshot) => {
          const filesArray: FileType[] = [];

          querySnapshot.forEach(async (document) => {
            const docRef = doc(db, `users/${document.data().uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              filesElements(filesArray, document, docSnap.data().pseudonym);
              setUserDrawings(filesArray);
              setLoadingFiles(true);
            } else {
              console.error('No such doc');
            }
          });
        },
        (e) => {
          console.error('Error', e);
        },
      );
    } catch (e) {
      console.error('Error', e);
      console.error('No such document!');
    }
  };

  useMemo(() => {
    return downloadDrawings();
  }, [nextPage]);

  return !loading ? (
    <>
      <article className={styles.categories__index__in__account}>
        <HeadCom path={router.asPath} content={`Subpage with ${index}`} />

        <em className={styles.title}>
          {data?.Aside?.category}: {index}
        </em>

        <Wrapper>
          {userDrawings.length > 0 ? (
            userDrawings.map(
              ({ fileUrl, time, description, pseudonym, tags, uid, idPost }: FileType) => (
                <Skeleton isLoaded={loadingFiles} key={time}>
                  {index === 'videos' ? (
                    <Videos
                      link={fileUrl}
                      description={description}
                      authorName={pseudonym}
                      refFile={userVideosRef(user?.uid!)}
                      refStorage={ref(storage, `${user?.uid}/videos/${description}`)}
                      tag={tags}
                      uid={uid}
                      idPost={idPost}
                    />
                  ) : (
                    <Article
                      link={fileUrl}
                      description={description}
                      authorName={pseudonym}
                      unopt={index === 'animations'}
                      refFile={
                        index === 'animations'
                          ? userAnimationsRef(user?.uid!)
                          : userPhotosRef(user?.uid!)
                      }
                      subCollection={index === 'animations' ? 'animations' : 'photos'}
                      refStorage={ref(
                        storage,
                        `${user?.uid}/${
                          index === 'animations' ? 'animations' : 'photos'
                        }/${description}`,
                      )}
                      tag={tags}
                      uid={uid}
                      idPost={idPost}
                    />
                  )}
                </Skeleton>
              ),
            )
          ) : (
            <ZeroFiles text={data?.ZeroFiles?.videos} />
          )}
        </Wrapper>
      </article>
    </>
  ) : null;
}
