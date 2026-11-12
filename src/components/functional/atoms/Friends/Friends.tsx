import { getI18n, getScopedI18n } from 'locales/server';

import { FriendsListArrayType } from 'types/global.types';

import { ContainerLink } from 'components/ui/atoms/ContainerLink/ContainerLink';

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

        {!!friendsAsideList && friendsAsideList.length > 0 ? (
          friendsAsideList.map(({ pseudonym, profilePhoto }, index) => (
            <ContainerLink
              link={`/user/${pseudonym}`}
              name={pseudonym}
              description=""
              logo={profilePhoto}
              alt={`${pseudonym}'s profile photo`}
              key={index}
            />
          ))
        ) : (
          <p className={styles.noFavFriends}>{t('Friends.noFavFriends')}</p>
        )}
      </details>
    </article>
  );
};
