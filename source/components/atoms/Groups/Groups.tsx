import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from '@chakra-ui/react';

<<<<<<< Updated upstream:components/atoms/Groups/Groups.tsx
import { DataType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'utilites/constants';
=======
import { backUrl, cloudFrontUrl } from 'source/constants/links';
>>>>>>> Stashed changes:source/components/atoms/Groups/Groups.tsx

import { Links } from 'source/components/atoms/Links/Links';

import styles from './Groups.module.scss';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
<<<<<<< Updated upstream:components/atoms/Groups/Groups.tsx
=======
import { useCurrentLocale, useI18n, useScopedI18n } from "source/locales/client";
>>>>>>> Stashed changes:source/components/atoms/Groups/Groups.tsx

type FavGroupsType = {
  name: string;
  description: string;
  logo: string;
};
export const Groups = ({ data }: DataType) => {
  const [groupsArray, setGroupsArray] = useState<FavGroupsType[]>([]);
  const [open, setOpen] = useState(false);

  const { locale } = useRouter();

  const arrowIcons = '1.5rem';
  const changeOpenGroups = () => setOpen(!open);

  const groupList = async () => {
    try {
      const groupList: FavGroupsType[] = [];

      const favsGroups: { data: FavGroupsType[] } = await axios.get(`${backUrl}/groups/favorites`);

      for (const favorite of favsGroups.data) {
        groupList.push({
          name: favorite.name,
          description: favorite.description,
          logo: !!favorite.logo
            ? `https://${cloudFrontUrl}/${favorite.logo}`
            : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }
      setGroupsArray(groupList);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    groupList();
  }, []);

  return (
    <div className={styles.groups}>
      <h3 className={styles.title} onClick={changeOpenGroups}>
        <p className={locale === 'jp' ? styles.title__jp : ''}>{data?.Aside?.groups}</p>
        {open ? <TriangleUpIcon w={arrowIcons} h={arrowIcons} /> : <TriangleDownIcon w={arrowIcons} h={arrowIcons} />}
      </h3>

      <div className={open ? styles.groups__container : styles.hiddenGroups}>
        {groupsArray.length > 0 ? (
          groupsArray.map(({ name, logo, description }, index) => (
            <div className={styles.container} key={index}>
              <img src={logo} alt={`${name} logo`} />
              <Links hrefLink={`/groups/${name}`} classLink={styles.container__item} arial-label={description}>
                <h4>{name}</h4>
              </Links>
            </div>
          ))
        ) : (
          <p className={styles.no__groups}>{data?.Groups?.noGroups}</p>
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
