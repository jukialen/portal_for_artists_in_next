import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';
import { getDoc } from 'firebase/firestore';

import { useHookSWR } from 'hooks/useHookSWR';

import { user } from 'config/referencesFirebase';

import styles from './Friends.module.scss';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

type FriendsListArrayType = {
  name: string;
  profilePhoto: string;
};

export const Friends = () => {
  const [favoriteFriendArray, setFavoriteFriendArray] = useState<FriendsListArrayType[]>([]);
  const [open, setOpen] = useState(false);

  const data = useHookSWR();
  const { locale } = useRouter();

  const currentUser = auth.currentUser?.uid;
  const arrowIcons = '1.5rem';

  const changeOpenFriends = () => setOpen(!open);

  const downloadFavoriteFriendsList = async () => {
    const docSnap = await getDoc(user(currentUser!));

    const favoriteFriendArray: FriendsListArrayType[] = [];

    if (docSnap.exists()) {
      for (const favoriteFriend of docSnap.data().favoriteFriends) {
        const favoriteFriendSnap = await getDoc(user(favoriteFriend));

        favoriteFriendSnap.exists() &&
          favoriteFriendArray.push({
            name: favoriteFriendSnap.data().pseudonym,
            profilePhoto:
              favoriteFriendSnap.data().profilePhoto ||
              `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
          });
      }
      setFavoriteFriendArray(favoriteFriendArray);
    }
  };

  useEffect(() => {
    !!currentUser && downloadFavoriteFriendsList();
  }, [currentUser]);

  return (
    <div className={styles.friends}>
      <h3 className={styles.title} onClick={changeOpenFriends}>
        <p className={locale === 'jp' ? styles.title__jp : styles.title__others}>
          {data?.Aside?.friends}
        </p>
        {open ? (
          <TriangleUpIcon w={arrowIcons} h={arrowIcons} />
        ) : (
          <TriangleDownIcon w={arrowIcons} h={arrowIcons} />
        )}
      </h3>

      <div className={open ? styles.container : styles.hiddenFriends}>
        {favoriteFriendArray.length > 0 ? (
          favoriteFriendArray.map(({ name, profilePhoto }, index) => (
            <Link href={`/user/${name}`} key={index}>
              <a className={styles.link}>
                <div className={styles.item}>
                  <Image src={profilePhoto} layout="fill" alt={name} />
                </div>
                <div className={styles.pseudonym}>{name}</div>
              </a>
            </Link>
          ))
        ) : (
          <p className={styles.noFavFriends}>{data?.Friends?.noFavFriends}</p>
        )}
      </div>
    </div>
  );
};
