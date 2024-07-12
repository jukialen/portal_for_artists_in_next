'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@chakra-ui/next-js';
import axios from 'axios';

import { useCurrentLocale, useI18n, useScopedI18n } from "locales/client";

import { backUrl, cloudFrontUrl } from 'constants/links';

import { UserType } from "types/global.types";

import styles from './Friends.module.scss';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

type FriendsListArrayType = {
  pseudonym: string;
  profilePhoto: string;
  favorites: number;
};

export const Friends = ({ userData } : { userData: UserType }) => {
  const [favoriteFriendArray, setFavoriteFriendArray] = useState<FriendsListArrayType[]>([]);
  const [open, setOpen] = useState(false);

  const t = useI18n();
  const tAside = useScopedI18n('Aside');
  const locale = useCurrentLocale();
  
  const arrowIcons = '1.5rem';
  const maxItems = 5;
  const changeOpenFriends = () => setOpen(!open);

  const downloadFavoriteFriendsList = async () => {
    const favoriteFriendArray: FriendsListArrayType[] = [];

    const firstPage: { data: FriendsListArrayType[] } = await axios.get(`${backUrl}/friends/all`, {
      params: {
        queryData: {
          where: {
            AND: [{ usernameId: userData.id }, { favorite: true }],
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
    !!userData?.id && downloadFavoriteFriendsList();
  }, [userData?.id]);

  return (
    <div className={styles.friends}>
      <h3 className={styles.title} onClick={changeOpenFriends}>
        <p className={locale === 'jp' ? styles.title__jp : styles.title__others}>{tAside('friends')}</p>
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
          <p className={styles.noFavFriends}>{t('Friends.noFavFriends')}</p>
        )}
      </div>
    </div>
  );
};
