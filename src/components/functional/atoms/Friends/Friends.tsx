import Image from 'next/image';
import Link from 'next/link';

import { getI18n, getScopedI18n } from 'locales/server';

import { FriendsListArrayType } from 'types/global.types';

import styles from './Friends.module.css';
import { RiArrowDownSLine } from 'react-icons/ri';

export const Friends = async ({ friendsAsideList }: { friendsAsideList: FriendsListArrayType[] }) => {
  const t = await getI18n();
  const tAside = await getScopedI18n('Aside');

  return (
    <article className={styles.friends}>
      <details className={styles.title}>
        <summary className={styles.withIcon}>
          <h3 className={styles.title__others}>{tAside('friends')}</h3>
          <RiArrowDownSLine className={styles.categoryArrow} />
        </summary>

        <section className={styles.container}>
          {!!friendsAsideList && friendsAsideList.length > 0 ? (
            friendsAsideList.map(({ pseudonym, profilePhoto }, index) => (
              <Link href={`/user/${pseudonym}`} key={index} className={styles.link}>
                <Image src={profilePhoto} className={styles.image} fill alt={`${pseudonym}'s profile photo`} />
                <h4 className={styles.pseudonym}>{pseudonym}</h4>
              </Link>
            ))
          ) : (
            <p className={styles.noFavFriends}>{t('Friends.noFavFriends')}</p>
          )}
        </section>
      </details>
    </article>
  );
};
