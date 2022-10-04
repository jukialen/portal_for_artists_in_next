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

import {
  allPhotosCollectionRef,
  user as currentUser,
  userPhotosRef,
} from 'references/referencesFirebase';

import { filesElements } from 'helpers/fileElements';

import { FileType, UserType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';

export const PhotosGallery = ({ user, pseudonym, data }: UserType) => {
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);

  const maxItems = 30;
  const { asPath } = useRouter();

  const downloadFiles = async () => {
    try {
      const firstPage = query(
        userPhotosRef(user!),
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
      setUserPhotos(filesArray);
      filesArray.length === maxItems &&
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    !!user && downloadFiles();
  }, [user]);

  const nextElements = async () => {
    try {
      const nextPage = query(
        allPhotosCollectionRef(),
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
      }
      const newArray = userPhotos.concat(...nextArray);
      setUserPhotos(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article id="user__gallery__in__account" className="user__gallery__in__account">
      {decodeURIComponent(asPath) === `/account/${pseudonym}` && (
        <em className="title">{data?.Account?.gallery?.userPhotosTitle}</em>
      )}

      <Wrapper>
        {userPhotos.length > 0 ? (
          userPhotos.map(
            ({ fileUrl, description, time, tags, pseudonym, uid, idPost }: FileType, index) => (
              <Article
                key={index}
                link={fileUrl}
                refFile={userPhotosRef(user!)}
                subCollection="photos"
                refStorage={ref(storage, `${user}/photos/${description}`)}
                description={description}
                tag={tags}
                authorName={pseudonym}
                uid={uid}
                idPost={idPost}
              />
            ),
          )
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.photos} />
        )}

        {!!lastVisible && userPhotos.length === maxItems * i && (
          <MoreButton nextElements={nextElements} />
        )}
      </Wrapper>
    </article>
  );
};
