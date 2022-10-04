import { useEffect, useState } from 'react';
import {
  DocumentData,
  getDoc,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from 'firebase/firestore';

import { useHookSWR } from 'hooks/useHookSWR';

import { friends } from 'references/referencesFirebase';

import { Tile } from 'components/molecules/GroupTile/Tile';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './FriendsList.module.scss';

type FriendsListType = {
  uid: string;
};

type FriendsListArrayType = {
  name: string;
  profilePhoto: string;
};

export const FriendsList = ({ uid }: FriendsListType) => {
  const [friendsList, setFriendsList] = useState<FriendsListArrayType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);

  const data = useHookSWR();
  const maxItems = 30;

  const sortAsc = (a: FriendsListArrayType, b: FriendsListArrayType) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  };

  const downloadFriends = async () => {
    try {
      const firstPage = query(friends(uid!), limit(maxItems));

      const friendArray: FriendsListArrayType[] = [];

      const documentSnapshots = await getDocs(firstPage);

      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().friend);

        docSnap.exists() &&
          friendArray.push({
            name: docSnap.data().pseudonym,
            profilePhoto:
              docSnap.data().profilePhoto || `${process.env.NEXT_PUBLIC_PAGE}/friends.svg}`,
          });
      }
      friendArray.sort(sortAsc);
      setFriendsList(friendArray);
      friendArray.length === maxItems &&
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!uid && downloadFriends();
  }, [uid]);

  const nextFriends = async () => {
    try {
      const nextPage = query(friends(uid!), limit(maxItems), startAfter(lastVisible));

      const nextFriendArray: FriendsListArrayType[] = [];

      const documentSnapshots = await getDocs(nextPage);
      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().friend);

        docSnap.exists() &&
          nextFriendArray.push({
            name: docSnap.data().pseudonym,
            profilePhoto:
              docSnap.data().profilePhoto || `${process.env.NEXT_PUBLIC_PAGE}/friends.svg}`,
          });
      }
      const nextArray = friendsList.concat(...nextFriendArray);
      nextArray.sort(sortAsc);
      setFriendsList(nextArray);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.container__section}>
        {friendsList.length > 0 ? (
          friendsList.map(({ name, profilePhoto }, index) => (
            <Tile key={index} name={name} link={`/user/${name}`} logoUrl={profilePhoto} />
          ))
        ) : (
          <p className={styles.noFriends}>{data?.Friends?.noFriends}</p>
        )}
      </section>
      {!!lastVisible && friendsList.length === maxItems * i && (
        <MoreButton nextElements={nextFriends} />
      )}
    </div>
  );
};
