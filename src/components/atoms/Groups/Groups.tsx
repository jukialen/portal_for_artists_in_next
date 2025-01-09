import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

import { useCurrentLocale, useI18n, useScopedI18n } from 'locales/client';

import { GroupsType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx';

export const Groups = ({ groupsAsideList }: { groupsAsideList: GroupsType[] }) => {
  const [open, setOpen] = useState(false);

  const locale = useCurrentLocale();
  const t = useI18n();
  const tAside = useScopedI18n('Aside');

  const arrowIcons = '1.5rem';
  
  const changeOpenGroups = () => setOpen(!open);

  return (
    <div className={styles.groups}>
      <h3 className={styles.title} onClick={changeOpenGroups}>
        <p className={locale === 'jp' ? styles.title__jp : ''}>{tAside('groups')}</p>
        {open ? (
          <RxTriangleUp width={arrowIcons} height={arrowIcons} />
        ) : (
          <RxTriangleDown width={arrowIcons} height={arrowIcons} />
        )}
      </h3>

      <div className={open ? styles.groups__container : styles.hiddenGroups}>
        {groupsAsideList.length > 0 ? (
          groupsAsideList.map(({ name, logo, description }, index) => (
            <div className={styles.container} key={index}>
              <img src={logo} alt={`${name} logo`} />
              <Links hrefLink={`/groups/${name}`} classLink={styles.container__item} arial-label={description}>
                <h4>{name}</h4>
              </Links>
            </div>
          ))
        ) : (
          <p className={styles.no__groups}>{t('Groups.noGroups')}</p>
        )}
        <Button colorScheme="orange" borderColor="transparent" className={styles.listButton} variant="ghost">
          <Link href="/groups/list" aria-label="all group link">
            All groups
          </Link>
        </Button>
      </div>
    </div>
  );
};
