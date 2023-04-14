import { useEffect, useState } from 'react';

import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import { backUrl } from 'utilites/constants';

import { Tile } from 'components/molecules/GroupTile/Tile';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './FriendsList.module.scss';
import axios from 'axios';

type FriendsListType = {
  uid: string;
};

type FriendsListArrayType = {
  pseudonym: string;
  profilePhoto: string;
};

export const FriendsList = ({ uid }: FriendsListType) => {
  const [friendsList, setFriendsList] = useState<FriendsListArrayType[]>([]);
  const [lastVisible, setLastVisible] = useState<string | null>();
  let [i, setI] = useState(1);
  const { id } = useUserData();

  const data = useHookSWR();
  const maxItems = 30;

  

  const firstFriends = async () => {
    try {
      const friendsId: [{ usernameId: string, friendId: string }] = await axios.get('/friends', {
        params: {
          where: {
            usernameId: id,
          },
          orderBy: 'friendId, DESC',
          limit: maxItems,
        },
      });

      const friendArray: FriendsListArrayType[] = [];

      await friendsId.forEach(async (friend) => {
        const friends: FriendsListArrayType = await axios.get(`${backUrl}/users`, {
          params: {
            where: { id: friend },
          },
        });

        const { pseudonym, profilePhoto } = friends;

        friendArray.push({ pseudonym, profilePhoto });
      });
      setFriendsList(friendArray);
      friendArray.length === maxItems &&
      setLastVisible(friendsId[friendsId.length - 1].usernameId);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!uid && firstFriends();
  }, [uid]);

  const nextFriends = async () => {
    try {
      const friendsId: [{ usernameId: string, friendId: string }] = await axios.get(`${backUrl}/users`, {
        params: {
          where: {
            usernameId: id,
          },
          orderBy: 'friendId, DESC',
          limit: maxItems,
          cursor: lastVisible
        },
      });

      const nextFriendArray: FriendsListArrayType[] = [];

      await friendsId.forEach(async (friend) => {
        const friends: FriendsListArrayType = await axios.get('/users', {
          params: {
            where: { id: friend },
          },
        });

        const { pseudonym, profilePhoto } = friends;

        nextFriendArray.push({ pseudonym, profilePhoto });
      });      
      const nextArray = friendsList.concat(...nextFriendArray);
      setFriendsList(nextArray);
      setLastVisible(friendsId[friendsId.length - 1].usernameId);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.container__section}>
        {friendsList.length > 0 ? (
          friendsList.map(({ pseudonym, profilePhoto }, index) => (
            <Tile key={index} name={pseudonym} link={`/user/${pseudonym}`} logoUrl={profilePhoto} />
          ))
        ) : (
          <p className={styles.noFriends}>{data?.Friends?.noFriends}</p>
        )}
      </section>
      {!!lastVisible && friendsList.length === maxItems * i && <MoreButton nextElements={nextFriends} />}
    </div>
  );
};
