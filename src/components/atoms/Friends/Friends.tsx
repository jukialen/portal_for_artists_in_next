import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useCurrentLocale, useI18n, useScopedI18n } from 'locales/client';

import { FriendsListArrayType } from 'types/global.types';

import styles from './Friends.module.scss';
import { RiArrowUpSLine } from 'react-icons/ri';

export const Friends = ({ friendsAsideList }: { friendsAsideList: FriendsListArrayType[] }) => {
  const [open, setOpen] = useState(false);

  const t = useI18n();
  const tAside = useScopedI18n('Aside');
  const locale = useCurrentLocale();

  const changeOpenFriends = () => setOpen(!open);

  return (
    <div className={styles.friends}>
      <h3 className={styles.title} onClick={changeOpenFriends}>
        <p className={locale === 'jp' ? styles.title__jp : styles.title__others}>{tAside('friends')}</p>
        <RiArrowUpSLine
          style={{
            transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
            display: 'inline-block',
          }}
        />
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
