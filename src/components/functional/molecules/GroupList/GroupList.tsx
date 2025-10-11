'use client';

import { useState } from 'react';

import { GroupListType } from 'types/global.types';

import { nextGroupList } from 'utils/groups';

import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';
import { Tile } from 'components/ui/atoms/Tile/Tile';

import styles from './GroupList.module.scss';

type GroupsType = {
  list: {
    title: string;
    all: string;
  };
  noGroups: string;
};

export const GroupList = ({ Groups, groupArray }: { Groups: GroupsType; groupArray: GroupListType[] | undefined }) => {
  const maxItems = 30;

  const [listArray, setListArray] = useState<GroupListType[] | undefined>(groupArray);
  const [lastVisible, setLastVisible] = useState(
    !!groupArray && groupArray.length === maxItems ? groupArray[groupArray.length - 1].name : '',
  );
  let [i, setI] = useState(1);

  const nextGroupsList = async () => {
    const groupArray = await nextGroupList(maxItems, lastVisible!);

    setListArray(listArray!.concat(...groupArray));

    if (listArray?.length === maxItems) {
      setLastVisible(groupArray[groupArray.length - 1].name);
      setI(++i);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.container__section}>
        <h2 className={styles.title}>{Groups.list.title}</h2>
        <div className={styles.list}>
          {!!listArray && listArray.length > 0 ? (
            listArray.map(({ name, fileUrl }, index) => (
              <Tile key={index} name={name} link={`/groups/${name}`} fileUrl={fileUrl} />
            ))
          ) : (
            <p>{Groups.noGroups}</p>
          )}
        </div>
      </div>
      {!!lastVisible && !!listArray && listArray.length === maxItems * i && (
        <MoreButton nextElementsAction={nextGroupsList} />
      )}

      {!lastVisible && !!listArray && listArray.length >= maxItems * i && (
        <p className={styles.noALl}>{Groups.list.all}</p>
      )}
    </section>
  );
};
