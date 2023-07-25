import { useEffect, useState } from 'react';
import axios from 'axios';

import { useHookSWR } from 'hooks/useHookSWR';

import { backUrl } from 'utilites/constants';

import { FriendType, UserType } from 'types/global.types';

import { Tile } from 'components/molecules/GroupTile/Tile';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './FriendsList.module.scss';

type FriendsListType = {
  id: string;
};

type FriendsListArrayType = {
  pseudonym: string;
  profilePhoto: string;
};

export const FriendsList = ({ id }: FriendsListType) => {
  const [friendsList, setFriendsList] = useState<FriendsListArrayType[]>([]);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  let [i, setI] = useState(1);

  const data = useHookSWR();
  const maxItems = 30;

  const firstFriends = async () => {
    try {
      const friendsId: FriendType[] = await axios.get(`${backUrl}/friends`, {
        params: {
          where: { usernameId: id },
          orderBy: 'friendId, DESC',
          limit: maxItems,
        },
      });

      const friendArray: FriendsListArrayType[] = [];

      for (const friend of friendsId) {
        const friends: UserType = await axios.get(`${backUrl}/users/${friend.friendId}`);

        const { pseudonym, profilePhoto } = friends;

        friendArray.push({ pseudonym, profilePhoto: profilePhoto! });
      }
      setFriendsList(friendArray);
      friendArray.length === maxItems && setLastVisible(friendsId[friendsId.length - 1].usernameId);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstFriends();
  }, [id]);

  const nextFriends = async () => {
    try {
      const friendsId: FriendType[] = await axios.get(`${backUrl}/friends`, {
        params: {
          where: { usernameId: id },
          orderBy: 'friendId, DESC',
          limit: maxItems,
          cursor: lastVisible,
        },
      });

      const nextFriendArray: FriendsListArrayType[] = [];

      for (const friend of friendsId) {
        const friends: FriendsListArrayType = await axios.get(`${backUrl}/users/${friend.friendId}`);
        const { pseudonym, profilePhoto } = friends;

        nextFriendArray.push({ pseudonym, profilePhoto });
      }
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
      <h2 className={styles.title}>{data?.Nav?.friends}</h2>
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
