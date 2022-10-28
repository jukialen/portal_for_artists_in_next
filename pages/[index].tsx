import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, storage } from '../firebase';
import { ref } from 'firebase/storage';
import { getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter, where } from 'firebase/firestore';

import { FileType } from 'types/global.types';

import { filesElements } from 'helpers/fileElements';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import { allCollectionRef, user, userAnimationsRef, userPhotosRef, userVideosRef } from 'references/referencesFirebase';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

import styles from './categories_index.module.scss';

export default function Drawings() {
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);

  const router = useRouter();
  const loading = useCurrentUser('/');
  const data = useHookSWR();

  const currentUser = auth?.currentUser;
  const { index: indexItems } = router.query;
  const maxItems = 3;

  const firstDrawings = async () => {
    try {
      const firstPage = indexItems === 'animations' || 'videos'
            ? query(
                allCollectionRef(indexItems),
                where('tag', '==', indexItems),
                orderBy('timeCreated', 'desc'),
                limit(maxItems))
            : query(
                allCollectionRef('photos'),
                where('tag', '==', indexItems),
                orderBy('timeCreated', 'desc'),
                limit(maxItems))
      console.log('fR', firstPage);

      const filesArray: FileType[] = [];

      const documentSnapshots = await getDocs(firstPage);

      console.log(documentSnapshots.docs);
      for (const document of documentSnapshots.docs) {
        const docSnap = await getDoc(user(document.data().uid));

        // console.log(docSnap);
        if (docSnap.exists()) {
          filesElements(filesArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No such doc');
        }
      }
      // console.log(filesArray);

      setUserDrawings(filesArray);
      filesArray.length === maxItems && setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error('Error', e);
      console.error('No such document!');
    }
  };

  useEffect(() => {
    console.log(indexItems);
    !!indexItems && firstDrawings();
  }, [indexItems]);

  const nextDrawings = async () => {
    try {
        const nextPage = indexItems === 'photographs' || 'others'
            ? query(
                allCollectionRef('photos'),
                where('tag', '==', indexItems),
                orderBy('timeCreated', 'desc'),
                limit(maxItems),
                startAfter(lastVisible))
            : query(
                allCollectionRef(indexItems),
                where('tag', '==', indexItems),
                orderBy('timeCreated', 'desc'),
                limit(maxItems),
                startAfter(lastVisible));

      const documentSnapshots = await getDocs(nextPage);

      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      const nextArray: FileType[] = [];

      for (const document of documentSnapshots.docs) {
        const docSnap = await getDoc(user(document.data().uid));

        if (docSnap.exists()) {
          filesElements(nextArray, document, docSnap.data().pseudonym);
        } else {
          console.error('No more docs');
        }
      }
      const newArray = userDrawings.concat(...nextArray);
      setUserDrawings(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return null;
  }

  // console.log('u', userDrawings);
  return (
    <>
      <article className={styles.categories__index__in__account}>
        <HeadCom path={router.asPath} content={`Subpage with ${indexItems}`} />

        <em className={styles.title}>
          {data?.Aside?.category}: {indexItems}
        </em>

        <Wrapper>
          {userDrawings.length > 0 ? (
            userDrawings.map(({ fileUrl, description, pseudonym, tags, uid, idPost }: FileType, index) => (
              <>
                {indexItems === 'videos' ? (
                  <Videos
                    link={fileUrl}
                    description={description}
                    authorName={pseudonym}
                    refFile={userVideosRef(currentUser?.uid!)}
                    refStorage={ref(storage, `${currentUser?.uid}/videos/${description}`)}
                    tag={tags}
                    uid={uid}
                    idPost={idPost}
                    key={index}
                  />
                ) : (
                  <Article
                    link={fileUrl}
                    description={description}
                    authorName={pseudonym}
                    unopt={indexItems === 'animations'}
                    refFile={
                      indexItems === 'animations'
                        ? userAnimationsRef(currentUser?.uid!)
                        : userPhotosRef(currentUser?.uid!)
                    }
                    subCollection={indexItems === 'animations' ? 'animations' : 'photos'}
                    refStorage={ref(
                      storage,
                      `${currentUser?.uid}/${indexItems === 'animations' ? 'animations' : 'photos'}/${description}`,
                    )}
                    tag={tags}
                    uid={uid}
                    idPost={idPost}
                    key={index}
                  />
                )}
              </>
            ))
          ) : (
            <ZeroFiles text={data?.ZeroFiles?.files} />
          )}

          {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextDrawings} />}
        </Wrapper>
      </article>
    </>
  );
}
