import Image from 'next/image';
import Link from 'next/link';

import { getI18n, getScopedI18n } from 'locales/server';

import { GroupsType } from 'types/global.types';

import { Links } from 'components/ui/atoms/Links/Links';

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
              <Links hrefLink={`/groups/${name}`} classLink={styles.image} arial-label={description} key={index}>
                <Image src={logo} className={styles.link} alt={`${name} logo`} fill priority />
                <h4 className={styles.name}>{name}</h4>
              </Links>
            ))
          ) : (
            <p className={styles.no__groups}>{t('Groups.noGroups')}</p>
          )}
          <div className={styles.listLink}>
            <Link href="/groups/list" className={styles.listButton} aria-label="all group link">
              All groups
            </Link>
          </div>
        </section>
      </details>
    </article>
  );
};
