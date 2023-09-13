import { useEffect, useState } from 'react';
import axios from 'axios';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { GroupType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/molecules/GroupTile/Tile';

import styles from './index.module.scss';

type GroupListType = {
  name: string;
  fileUrl: string;
};

export default function List() {
  const [listArray, setListArray] = useState<GroupListType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const data = useHookSWR();
  const loading = useCurrentUser('/signin');
  const maxItems = 30;

  const getGroupsList = async () => {
    const groups: { data: GroupType[] } = await axios.get(`${backUrl}/groups/all`, {
      params: {
        queryData: {
          orderBy: { name: 'desc' },
          limit: maxItems,
        },
      },
    });

    const groupArray: GroupListType[] = [];

    for (const _group of groups.data) {
      groupArray.push({
        name: _group.name!,
        fileUrl: !!_group.logo
          ? `https://${cloudFrontUrl}/${_group.logo}`
          : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
      });
    }

    groupArray.length === maxItems && setLastVisible(groupArray[groupArray.length - 1].name);
    setListArray(groupArray);
  };

  useEffect(() => {
    !loading && getGroupsList();
  }, [loading]);

  const nextGroupsList = async () => {
    const groups: { data: GroupType[] } = await axios.get(`${backUrl}/groups/all`, {
      params: {
        queryData: {
          orderBy: { name: 'desc' },
          limit: maxItems,
          cursor: lastVisible,
        },
      },
    });

    const groupArray: GroupListType[] = [];

    for (const _group of groups.data) {
      groupArray.push({
        name: _group.name!,
        fileUrl: !!_group.logo
          ? `https://${cloudFrontUrl}/${_group.logo}`
          : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
      });
    }

    setListArray(listArray.concat(...groupArray));
    setLastVisible(groupArray[groupArray.length - 1].name);
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
            listArray.map(({ name, fileUrl }, index) => (
              <Tile key={index} name={name} link={`/groups/${name}`} fileUrl={fileUrl} />
            ))
          ) : (
            <p>{data?.Groups?.noGroups}</p>
          )}
        </div>
      </div>
      {!!lastVisible && listArray.length === maxItems * i && <MoreButton nextElements={nextGroupsList} />}

      {!lastVisible && listArray.length >= maxItems * i && <p className={styles.noALl}>{data?.Groups?.list?.all}</p>}
    </section>
  );
}
