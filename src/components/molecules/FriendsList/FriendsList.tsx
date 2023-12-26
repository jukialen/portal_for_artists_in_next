'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

import { backUrl, cloudFrontUrl } from 'constants/links';

import { FriendType } from 'types/global.types';

import { Tile } from 'components/atoms/Tile/Tile';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './FriendsList.module.scss';

type FriendsListType = {
  id: string;
};

type FriendsListArrayType = {
  usernameId: string;
  pseudonym: string;
  fileUrl: string;
};

export const FriendsList = ({ id }: FriendsListType) => {
  const [friendsList, setFriendsList] = useState<FriendsListArrayType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);


  const maxItems = 30;

  const firstFriends = async () => {
    try {
      const friendsId: { data: FriendType[] } = await axios.get(`${backUrl}/friends/all`, {
        params: {
          queryData: {
            where: { usernameId: id },
            orderBy: { friendId: 'desc' },
            limit: maxItems,
          },
        },
      });

      const friendArray: FriendsListArrayType[] = [];

      for (const _f of friendsId.data) {
        friendArray.push({
          pseudonym: _f.pseudonym,
          fileUrl: !!_f.profilePhoto
            ? `https://${cloudFrontUrl}/${_f.profilePhoto}`
            : `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
          usernameId: _f.usernameId,
        });
      }
      setFriendsList(friendArray);
      friendArray.length === maxItems && setLastVisible(friendArray[friendArray.length - 1].usernameId);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstFriends();
  }, [id]);

  const nextFriends = async () => {
    try {
      const friends: { data: FriendType[] } = await axios.get(`${backUrl}/friends/all`, {
        params: {
          queryData: {
            where: { usernameId: id },
            orderBy: { friendId: 'desc' },
            limit: maxItems,
            cursor: lastVisible,
          },
        },
      });

      const nextFriendArray: FriendsListArrayType[] = [];

      for (const _f of friends.data) {
        nextFriendArray.push({
          pseudonym: _f.pseudonym,
          fileUrl: !!_f.profilePhoto
            ? `https://${cloudFrontUrl}/${_f.profilePhoto}`
            : `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
          usernameId: _f.usernameId,
        });
      }
      const nextArray = friendsList.concat(...nextFriendArray);
      setFriendsList(nextArray);
      setLastVisible(nextFriendArray[nextFriendArray.length - 1].usernameId);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{language?.Nav?.friends}</h2>
      <section className={styles.container__section}>
        {friendsList.length > 0 ? (
          friendsList.map(({ pseudonym, fileUrl }, index) => (
            <Tile key={index} name={pseudonym} link={`/user/${pseudonym}`} fileUrl={fileUrl} />
          ))
        ) : (
          <p className={styles.noFriends}>{language?.Friends?.noFriends}</p>
        )}
      </section>
      {!!lastVisible && friendsList.length === maxItems * i && <MoreButton nextElements={nextFriends} />}
    </div>
  );
};
