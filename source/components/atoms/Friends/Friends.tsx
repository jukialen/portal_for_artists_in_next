import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

<<<<<<< Updated upstream:components/atoms/Friends/Friends.tsx
import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import styles from './Friends.module.scss';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
=======
import { useUserData } from 'source/hooks/useUserData';

import { backUrl, cloudFrontUrl } from 'source/constants/links';

import styles from './Friends.module.scss';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useCurrentLocale, useI18n, useScopedI18n } from "source/locales/client";
>>>>>>> Stashed changes:source/components/atoms/Friends/Friends.tsx

type FriendsListArrayType = {
  pseudonym: string;
  profilePhoto: string;
  favorites: number;
};

export const Friends = () => {
  const [favoriteFriendArray, setFavoriteFriendArray] = useState<FriendsListArrayType[]>([]);
  const [open, setOpen] = useState(false);

  const data = useHookSWR();
  const { locale } = useRouter();
  const { id } = useUserData();

  const arrowIcons = '1.5rem';
  const maxItems = 5;
  const changeOpenFriends = () => setOpen(!open);

  const downloadFavoriteFriendsList = async () => {
    const favoriteFriendArray: FriendsListArrayType[] = [];

    const firstPage: { data: FriendsListArrayType[] } = await axios.get(`${backUrl}/friends/all`, {
      params: {
        queryData: {
          where: {
            AND: [{ usernameId: id }, { favorite: true }],
          },
          orderBy: { friendId: 'desc' },
          limit: maxItems,
        },
      },
    });

    for (const _f of firstPage.data) {
      favoriteFriendArray.push({
        pseudonym: _f.pseudonym,
        profilePhoto: !!_f.profilePhoto
          ? `https://${cloudFrontUrl}/${_f.profilePhoto}`
          : `${process.env.NEXT_PUBLIC_PAGE}/friends.svg`,
        favorites: _f.favorites,
      });
    }

    setFavoriteFriendArray(favoriteFriendArray);
  };

  useEffect(() => {
    !!id && downloadFavoriteFriendsList();
  }, [id]);

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
                <Image src={profilePhoto} fill alt={`${pseudonym}'s profile photo`} />
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
