'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Separator } from '@chakra-ui/react';

import { createClient } from 'utils/supabase/clientCSR';

import styles from './FriendsButtons.module.scss';
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io';

export const FriendsButtons = ({
  id,
  fid,
  friendBool,
  fav,
  favLength,
  pseudonym,
  translated,
}: {
  id: string;
  fid: string;
  friendBool: boolean;
  fav: boolean;
  favLength: number;
  pseudonym: string;
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
  const { push } = useRouter();

  fid === id && push(`/account/${pseudonym}`);

  const [friend, setFriend] = useState(friendBool);
  const [favorite, setFavorite] = useState(fav);
  const [favoriteLength, setFavoriteLength] = useState(favLength);

  const supabase = createClient();

  const addToFriends = async () => {
    try {
      if (friend) {
        const { error } = await supabase.from('Friends').delete().eq('username', id).eq('friendId', fid);
        if (!!error) {
          console.error(error);
        }

        setFavorite(false);
        setFriend(!friend);
      } else {
        const { data, error } = await supabase
          .from('Friends')
          .insert([{ friendId: fid, usernameId: id }])
          .eq('username', id)
          .eq('friendId', fid);

        if (!data || !!error) {
          console.error(error);
        }

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
        .eq('username', id)
        .eq('friendId', fid);

      if (!data || !!error) console.error(error);

      setFavorite(!favorite);
      setFavoriteLength(favorite ? favLength - 1 : favLength + 1);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className={styles.friendsButtons}>
        {id === fid ? null : (
          <button className={friend ? styles.addedButton : styles.addButton} onClick={addToFriends}>
            {friend ? <IoMdCheckmark size="1rem" /> : <IoMdAdd size="1.5rem" />}
            <p>{friend ? translated.added : translated.add}</p>
          </button>
        )}

        {id === fid ? null : !friend ? null : (
          <div>
            <button
              className={friend && favorite ? styles.addedButton : styles.addButton}
              onClick={toggleFavorites}
              disabled={favoriteLength === 5}>
              {favorite && favoriteLength !== 5 ? <IoMdCheckmark size="1rem" /> : <IoMdAdd size="1.5rem" />}
              <p>{friend && favorite ? translated.addedFav : translated.addFav}</p>
            </button>
            {!favorite && (
              <p>{!friend ? '' : !favorite && favoriteLength < 5 ? translated.max : translated.addedMax}</p>
            )}
          </div>
        )}
      </div>

      {id === fid ? null : <Separator orientation="horizontal" width="95%" />}
    </>
  );
};
