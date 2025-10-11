'use client';

import { useState } from 'react';

import { backUrl } from 'constants/links';
import { FriendsListType } from 'types/global.types';

import { createClient } from 'utils/supabase/clientCSR';

import { Tile } from 'components/ui/atoms/Tile/Tile';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';

import styles from './FriendsList.module.scss';

type FriendsListComponentType = {
  id: string;
  tFriends: { friends: string; noFriends: string };
  firstFriendsList: FriendsListType[];
};

export const FriendsList = ({ id, tFriends, firstFriendsList }: FriendsListComponentType) => {
  const [friendsList, setFriendsList] = useState<FriendsListType[]>(firstFriendsList);
  const [lastVisible, setLastVisible] = useState<string | null>(
    !!firstFriendsList && firstFriendsList.length > 0 ? firstFriendsList[firstFriendsList.length - 1].createdAt : null,
  );
  let [i, setI] = useState(1);

  const supabase = createClient();
  const maxItems = 30;

  const nextFriends = async () => {
    try {
      const nextArray: FriendsListType[] = [];

      const { data } = await supabase
        .from('Friends_View')
        .select('favorite, createdAt, updatedAt, pseudonym, profilePhoto, plan')
        .eq('usernameId', id)
        .order('createdAt', { ascending: false })
        .lt('createdAt', lastVisible)
        .limit(maxItems);

      if (data?.length === 0) return friendsList;

      for (const _f of data!) {
        const {} = _f;
        nextArray.push({
          favorite: _f.favorite!,
          pseudonym: _f.pseudonym!,
          fileUrl: !!_f.profilePhoto ? _f.profilePhoto : `${backUrl}/friends.svg`,
          plan: _f.plan!,
          createdAt: _f.createdAt!,
        });
      }
      const newArray = friendsList.concat(...nextArray);
      setFriendsList(newArray);
      setLastVisible(data?.length === 0 ? null : nextArray[nextArray.length - 1].createdAt!);
      data?.length !== 0 && setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{tFriends.friends}</h2>
      <section className={styles.container__section}>
        {!!friendsList && friendsList.length > 0 ? (
          friendsList.map(({ pseudonym, fileUrl }, index) => (
            <Tile key={index} name={pseudonym} link={`/user/${pseudonym}`} fileUrl={fileUrl} />
          ))
        ) : (
          <p className={styles.noFriends}>{tFriends.noFriends}</p>
        )}
      </section>
      {!!lastVisible && friendsList.length === maxItems * i && <MoreButton nextElementsAction={nextFriends} />}
    </div>
  );
};
