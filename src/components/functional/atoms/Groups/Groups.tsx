import Link from 'next/link';

import { getI18n, getScopedI18n } from 'locales/server';

import { GroupsType } from 'types/global.types';

import { ContainerLink } from 'components/ui/atoms/ContainerLink/ContainerLink';

import styles from './Groups.module.css';
import { RiArrowDownSLine } from 'react-icons/ri';

export const Groups = async ({ groupsAsideList }: { groupsAsideList: GroupsType[] }) => {
  const t = await getI18n();
  const tAside = await getScopedI18n('Aside');

  return (
    <article className={styles.groups}>
      <details className={styles.title}>
        <summary className={styles.withIcon}>
          <h3 className={styles.title__others}>{tAside('groups')}</h3>
          <RiArrowDownSLine className={styles.categoryArrow} />
        </summary>
        <section className={styles.container}>
          {!!groupsAsideList && groupsAsideList.length > 0 ? (
            groupsAsideList.map(({ name, logo, description }, index) => (
              <ContainerLink
                link={`/groups/${name}`}
                name={name}
                description={description}
                logo={logo}
                alt={`${name} logo`}
                key={index}
              />
            ))
          ) : (
            <p className={styles.no__groups}>{t('Groups.noGroups')}</p>
          )}
          <Link href="/groups/list" className={styles.listButton} aria-label="all group link">
            All groups
          </Link>
        </section>
      </details>
    </article>
  );
};
