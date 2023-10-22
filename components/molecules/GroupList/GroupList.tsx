'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import { backUrl, cloudFrontUrl } from 'constants/links';
import { GroupType } from 'types/global.types';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/atoms/Tile/Tile';

import styles from './GroupList.module.scss';

type GroupListType = {
  name: string;
  fileUrl: string;
};

type GroupsType = {
  list: {
    title: string,
    all: string
  },
  noGroups: string,
};

export const GroupList = ({ locale, Groups }: { locale: string, Groups: GroupsType }) => {
  const [listArray, setListArray] = useState<GroupListType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

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
     getGroupsList();
  }, []);

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

  return (
    <section className={styles.container}>
      <div className={styles.container__section}>
        <h2 className={styles.title}>{Groups.list.title}</h2>
        <div className={styles.list}>
          {listArray.length > 0 ? (
            listArray.map(({ name, fileUrl }, index) => (
              <Tile key={index} name={name} link={`/${locale}/groups/${name}`} fileUrl={fileUrl} />
            ))
          ) : (
            <p>{Groups.noGroups}</p>
          )}
        </div>
      </div>
      {!!lastVisible && listArray.length === maxItems * i && <MoreButton nextElements={nextGroupsList} />}

      {!lastVisible && listArray.length >= maxItems * i && (
        <p className={styles.noALl}>{Groups.list.all}</p>
      )}
    </section>
  );
};
