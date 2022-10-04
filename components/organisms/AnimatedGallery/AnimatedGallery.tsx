import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { storage } from '../../../firebase';
import { ref } from 'firebase/storage';
import {
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from 'firebase/firestore';

import { user as currentUser, userAnimationsRef } from 'references/referencesFirebase';

import { FileType, UserType } from 'types/global.types';

import { filesElements } from 'helpers/fileElements';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';

export const AnimatedGallery = ({ user, pseudonym, data }: UserType) => {
  const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);

  const { asPath } = useRouter();

  const maxItems = 30;

  const downloadAnimations = async () => {
    try {
      const firstPage = query(
        userAnimationsRef(user!),
        orderBy('timeCreated', 'desc'),
        limit(maxItems),
      );

      const filesArray: FileType[] = [];

      const documentSnapshots = await getDocs(firstPage);

      for (const document of documentSnapshots.docs) {
        const docSnap = await getDoc(currentUser(document.data().uid));
        if (docSnap.exists()) {
          filesElements(filesArray, document, !!pseudonym ? pseudonym : docSnap.data().pseudonym);
        } else {
          console.error('No such doc');
        }
      }
      setUserAnimatedPhotos(filesArray);
      filesArray.length === maxItems &&
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    !!user && downloadAnimations();
  }, [user]);

  const nextElements = async () => {
    try {
      const nextPage = query(
        userAnimationsRef(user!),
        orderBy('timeCreated', 'desc'),
        limit(maxItems),
        startAfter(lastVisible),
      );

      const documentSnapshots = await getDocs(nextPage);

      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      const nextArray: FileType[] = [];

      for (const document of documentSnapshots.docs) {
        const docSnap = await getDoc(currentUser(document.data().uid));

        if (docSnap.exists()) {
          filesElements(nextArray, document, docSnap.data().pseudonym);
        } else {
          console.log('No more drawings');
        }
        const newArray = userAnimatedPhotos.concat(...nextArray);
        setUserAnimatedPhotos(newArray);
        setI(++i);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article id="user__gallery__in__account" className="user__gallery__in__account">
      {decodeURIComponent(asPath) === `/account/${pseudonym}` && (
        <em className="title">{data?.Account?.gallery?.userAnimationsTitle}</em>
      )}

      <Wrapper>
        {userAnimatedPhotos.length > 0 ? (
          userAnimatedPhotos.map(
            ({ fileUrl, description, time, tags, uid, idPost }: FileType, index) => (
              <Article
                key={index}
                link={fileUrl}
                refFile={userAnimationsRef(user!)}
                subCollection="animations"
                refStorage={ref(storage, `${user}/animations/${description}`)}
                description={description}
                tag={tags}
                unopt
                uid={uid}
                idPost={idPost}
              />
            ),
          )
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.animations} />
        )}

        {!!lastVisible && userAnimatedPhotos.length === maxItems * i && (
          <MoreButton nextElements={nextElements} />
        )}
      </Wrapper>
    </article>
  );
};
