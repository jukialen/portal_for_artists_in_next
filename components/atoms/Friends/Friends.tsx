import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './Friends.module.scss';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

type FriendsListArrayType = {
  pseudonym: string;
  profilePhoto: string;
};

export const Friends = () => {
  const [favoriteFriendArray, setFavoriteFriendArray] = useState<FriendsListArrayType[]>([]);
  const [open, setOpen] = useState(false);

  const data = useHookSWR();
  const { locale } = useRouter();

  const arrowIcons = '1.5rem';

  const changeOpenFriends = () => setOpen(!open);

  const downloadFavoriteFriendsList = async () => {
    const favoriteFriendArray: FriendsListArrayType[] = [];

    //      for (const favoriteFriend of docSnap.data().favoriteFriends) {
    //
    //        favoriteFriendSnap.exists() &&
    //          favoriteFriendArray.push({
    //            name: favoriteFriendSnap.data().pseudonym,
    //            profilePhoto: favoriteFriendSnap.data().profilePhoto || `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
    //          });
    //      }
    setFavoriteFriendArray(favoriteFriendArray);
  };

  useEffect(() => {
    downloadFavoriteFriendsList();
  }, []);

  return (
    <div className={styles.friends}>
      <h3 className={styles.title} onClick={changeOpenFriends}>
        <p className={locale === 'jp' ? styles.title__jp : styles.title__others}>{data?.Aside?.friends}</p>
        {open ? <TriangleUpIcon w={arrowIcons} h={arrowIcons} /> : <TriangleDownIcon w={arrowIcons} h={arrowIcons} />}
      </h3>

      <div className={open ? styles.container : styles.hiddenFriends}>
        {favoriteFriendArray.length > 0 ? (
          favoriteFriendArray.map(({ pseudonym, profilePhoto }, index) => (
            <Link href={`/user/${pseudonym}`} key={index} className={styles.link}>
              <div className={styles.item}>
                <Image src={profilePhoto} layout="fill" alt={`${pseudonym}'s profile photo`} />
              </div>
              <div className={styles.pseudonym}>{pseudonym}</div>
            </Link>
          ))
        ) : (
          <p className={styles.noFavFriends}>{data?.Friends?.noFavFriends}</p>
        )}
      </div>
    </div>
  );
};
