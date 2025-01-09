import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useCurrentLocale, useI18n, useScopedI18n } from 'locales/client';

import { FriendsListArrayType } from "types/global.types";

import styles from './Friends.module.scss';
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx';

export const Friends = ({ friendsAsideList }: { friendsAsideList: FriendsListArrayType[] }) => {
  const [open, setOpen] = useState(false);

  const t = useI18n();
  const tAside = useScopedI18n('Aside');
  const locale = useCurrentLocale();

  const arrowIcons = '1.5rem';
  
  const changeOpenFriends = () => setOpen(!open);
  
  return (
    <div className={styles.friends}>
      <h3 className={styles.title} onClick={changeOpenFriends}>
        <p className={locale === 'jp' ? styles.title__jp : styles.title__others}>{tAside('friends')}</p>
        {open ? (
          <RxTriangleUp width={arrowIcons} height={arrowIcons} />
        ) : (
          <RxTriangleDown width={arrowIcons} height={arrowIcons} />
        )}
      </h3>

      <div className={open ? styles.container : styles.hiddenFriends}>
        {friendsAsideList.length > 0 ? (
          friendsAsideList.map(({ pseudonym, profilePhoto }, index) => (
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
