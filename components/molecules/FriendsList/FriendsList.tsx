import { useEffect, useState } from 'react';
import { getDoc } from 'firebase/firestore';

import { useHookSWR } from 'hooks/useHookSWR';

import { user } from 'references/referencesFirebase';

import { Tile } from 'components/molecules/GroupTile/Tile';

import styles from './FriendsList.module.scss';

type FriendsListType = {
  uid: string
}

type FriendsListArrayType = {
  name: string;
  profilePhoto: string;
}

export const FriendsList = ({ uid }: FriendsListType) => {
  const [friendsList, setFriendsList] = useState<FriendsListArrayType[]>([]);
  
  const data = useHookSWR();
  
  const downloadFriends = async () => {
    const docSnap = await getDoc(user(uid!));
    
    if (docSnap.exists()) {
      const friendList: FriendsListArrayType[] = [];
      
      for (const friend of docSnap.data().friends) {
        const userSnap = await getDoc(user(friend));
        userSnap.exists() && friendList.push({
          name: userSnap.data().pseudonym,
          profilePhoto: userSnap.data().profilePhoto || `${process.env.NEXT_PUBLIC_PAGE}/friends.svg}`
        });
      };
      
      setFriendsList(friendList);
    } else {
      console.log('No such friends!');
    }
  };
  
  useEffect(() => {
    !!uid && downloadFriends();
  }, [uid]);
  
  return <section className={styles.container}>
    {friendsList.length > 0 ? friendsList.map(({ name, profilePhoto }, index) => <Tile
      key={index}
      name={name}
      link={`/user/${name}`}
      logoUrl={profilePhoto}
    />) : <p className={styles.noFriends}>{data?.Friends?.noFriends}</p>}
  
  </section>;
};