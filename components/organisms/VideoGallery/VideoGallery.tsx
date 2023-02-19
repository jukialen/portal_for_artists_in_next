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

import { user as currentUser, userVideosRef } from 'config/referencesFirebase';

import { FileType, UserType } from 'types/global.types';

import { filesElements } from 'helpers/fileElements';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Videos } from 'components/molecules/Videos/Videos';

export const VideoGallery = ({ user, pseudonym, data }: UserType) => {
  const [userVideos, setUserVideos] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);

  const { asPath } = useRouter();

  const maxItems = 30;

  const downloadVideos = async () => {
    try {
      const firstPage = query(
        userVideosRef(user!),
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
      setUserVideos(filesArray);
      filesArray.length === maxItems &&
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    !!user && downloadVideos();
  }, [user]);

  const nextElements = async () => {
    try {
      const nextPage = query(
        userVideosRef(user!),
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
      const newArray = userVideos.concat(...nextArray);
      setUserVideos(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article id="user__gallery__in__account" className="user__gallery__in__account">
      {decodeURIComponent(asPath) === `/account/${pseudonym}` && (
        <em className="title">{data?.Account?.gallery?.userVideosTitle}</em>
      )}

      <Wrapper>
        {userVideos.length > 0 ? (
          userVideos.map(({ fileUrl, description, time, tags, uid, idPost }: FileType, index) => (
            <Videos
              key={index}
              link={fileUrl}
              refFile={userVideosRef(user!)}
              refStorage={ref(storage, `${user}/videos/${description}`)}
              description={description}
              tag={tags}
              uid={uid}
              idPost={idPost}
            />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.videos} />
        )}

        {!!lastVisible && userVideos.length === maxItems * i && (
          <MoreButton nextElements={nextElements} />
        )}
      </Wrapper>
    </article>
  );
};
