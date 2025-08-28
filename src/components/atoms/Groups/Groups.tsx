import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

import { useCurrentLocale, useI18n, useScopedI18n } from 'locales/client';

import { GroupsType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';
import { RiArrowUpSLine } from 'react-icons/ri';

export const Groups = ({ groupsAsideList }: { groupsAsideList: GroupsType[] }) => {
  const [open, setOpen] = useState(false);

  const locale = useCurrentLocale();
  const t = useI18n();
  const tAside = useScopedI18n('Aside');

  const changeOpenGroups = () => setOpen(!open);

  return (
    <div className={styles.groups}>
      <h3 className={styles.title} onClick={changeOpenGroups}>
        <p className={locale === 'jp' ? styles.title__jp : ''}>{tAside('groups')}</p>
        <RiArrowUpSLine
          style={{
            transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
            display: 'inline-block',
          }}
        />
      </h3>

      <div className={open ? styles.groups__container : styles.hiddenGroups}>
        {!!groupsAsideList && groupsAsideList.length > 0 ? (
          groupsAsideList.map(({ name, logo, description }, index) => (
            <div className={styles.container} key={index}>
              <Image src={logo} alt={`${name} logo`} fill priority />
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
