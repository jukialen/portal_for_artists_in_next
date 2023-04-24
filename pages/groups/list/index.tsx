import { useEffect, useState } from 'react';
import axios from 'axios';

import { backUrl } from 'utilites/constants';

import { GroupType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/molecules/GroupTile/Tile';

import styles from './index.module.scss';

export default function List() {
  const [listArray, setListArray] = useState<GroupType[]>([]);
  const [lastVisible, setLastVisible] = useState<GroupType>();
  let [i, setI] = useState(1);

  const data = useHookSWR();
  const loading = useCurrentUser('/');
  const maxItems = 30;

  const getGroupsList = async () => {
    const groups: GroupType[] = await axios.get(`${backUrl}/groups`, {
      params: {
        sortBy: 'name, DESC',
        limit: maxItems,
      },
    });

    const groupArray: GroupType[] = [];

    for (const group of groups) {
      groupArray.push({
        name: group.name,
        logoUrl: group.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
      });
    }
    groupArray.length === maxItems && setLastVisible(groupArray[groupArray.length - 1]);
    setListArray(groupArray);
  };

  useEffect(() => {
    !loading && getGroupsList();
  }, [loading]);

  const nextGroupsList = async () => {
    const groups: GroupType[] = await axios.get(`${backUrl}/groups`, {
      params: {
        sortBy: 'name, DESC',
        limit: maxItems,
        cursor: lastVisible,
      },
    });

    const groupArray: GroupType[] = [];

    for (const group of groups) {
      groupArray.push({
        name: group.name,
        logoUrl: group.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
      });
    }

    setListArray(listArray.concat(...groupArray));
    setLastVisible(groupArray[groupArray.length - 1]);
    setI(++i);
  };

  if (loading) {
    return null;
  }

  return (
    <section className={styles.container}>
      <div className={styles.container__section}>
        <h2 className={styles.title}>{data?.Groups?.list?.title}</h2>
        <div className={styles.list}>
          {listArray.length > 0 ? (
            listArray.map(({ name: nameGroup, logoUrl }, index) => (
              <Tile key={index} name={nameGroup} link={`/groups/${nameGroup}`} logoUrl={logoUrl} />
            ))
          ) : (
            <p>{data?.Groups?.noGroups}</p>
          )}
        </div>
      </div>
      {!!lastVisible && listArray.length === maxItems * i ? (
        <MoreButton nextElements={nextGroupsList} />
      ) : (
        <p className={styles.noALl}>{data?.Groups?.list?.all}</p>
      )}
    </section>
  );
}
