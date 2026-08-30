'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from 'utils/supabase/clientCSR';

import { Separator } from 'components/ui/atoms/Separator/Separator';

import styles from './FriendsButtons.module.css';
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io';

export const FriendsButtons = ({
  id,
  fid,
  friendBool,
  fav,
  favLength,
  translated,
}: {
  id: string;
  fid: string;
  friendBool: boolean;
  fav: boolean;
  favLength: number;
  translated: {
    friends: string;
    noFriends: string;
    added: string;
    add: string;
    addedFav: string;
    addFav: string;
    max: string;
    addedMax: string;
  };
}) => {
  const [friend, setFriend] = useState(friendBool);
  const [favorite, setFavorite] = useState(fav);
  const [favoriteLength, setFavoriteLength] = useState(favLength);

  const supabase = createClient();

  const addToFriends = async () => {
    try {
      if (friend) {
        const { error } = await supabase.from('Friends').delete().eq('usernameId', id).eq('friendId', fid);
        if (!!error) console.error(error);

        setFavorite(false);
        setFriend(!friend);
      } else {
        const { data, error } = await supabase.from('Friends').insert([{ friendId: fid, usernameId: id }]);

        if (!data || !!error) console.error(error);

        setFriend(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('Friends')
        .update({ favorite: !favorite })
        .eq('usernameId', id)
        .eq('friendId', fid);

      if (!data || !!error) return;

      setFavorite((prev) => !prev);
      setFavoriteLength((prev) => (favorite ? prev - 1 : prev + 1));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className={styles.friendsButtons}>
        <button className={friend ? styles.addedButton : styles.addButton} onClick={addToFriends}>
          {friend ? <IoMdCheckmark size="1rem" /> : <IoMdAdd size="1.5rem" />}
          {friend ? translated.added : translated.add}
        </button>

        <button
          className={friend && favorite ? styles.addedButton : styles.addButton}
          onClick={toggleFavorites}
          disabled={favoriteLength === 5}>
          {favorite && favoriteLength !== 5 ? <IoMdCheckmark size="1rem" /> : <IoMdAdd size="1.5rem" />}
          {friend && favorite ? translated.addedFav : translated.addFav}
        </button>
        {friend && !favorite && (
          <p>{!friend ? '' : !favorite && favoriteLength < 5 ? translated.max : translated.addedMax}</p>
        )}
      </div>

      {id === fid ? null : <Separator />}
    </>
  );
};
