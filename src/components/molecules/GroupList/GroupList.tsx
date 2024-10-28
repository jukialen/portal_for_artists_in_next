'use client';

import { useState } from 'react';
import axios from 'axios';

import { backUrl, cloudFrontUrl } from 'constants/links';
import { GroupListType, GroupType, LangType } from 'types/global.types';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/atoms/Tile/Tile';

import styles from './GroupList.module.scss';

type GroupsType = {
  list: {
    title: string;
    all: string;
  };
  noGroups: string;
};

export const GroupList = ({
  locale,
  Groups,
  groupArray,
}: {
  locale: LangType;
  Groups: GroupsType;
  groupArray: GroupListType[] | undefined;
}) => {
  const [listArray, setListArray] = useState<GroupListType[] | undefined>(groupArray);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  let [i, setI] = useState(1);

  const maxItems = 30;
  
  !!groupArray && groupArray.length === maxItems && setLastVisible(groupArray[groupArray.length - 1].name);
  
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

    setListArray(listArray!.concat(...groupArray));
    setLastVisible(groupArray[groupArray.length - 1].name);
    setI(++i);
  };

  return (
    <section className={styles.container}>
      <div className={styles.container__section}>
        <h2 className={styles.title}>{Groups.list.title}</h2>
        <div className={styles.list}>
          {!!listArray && listArray.length > 0 ? (
            listArray.map(({ name, fileUrl }, index) => (
              <Tile key={index} name={name} link={`/${locale}/groups/${name}`} fileUrl={fileUrl} />
            ))
          ) : (
            <p>{Groups.noGroups}</p>
          )}
        </div>
      </div>
      {!!lastVisible && !!listArray && listArray.length === maxItems * i && <MoreButton nextElements={nextGroupsList} />}

      {!lastVisible && !!listArray && listArray.length >= maxItems * i && <p className={styles.noALl}>{Groups.list.all}</p>}
    </section>
  );
};
