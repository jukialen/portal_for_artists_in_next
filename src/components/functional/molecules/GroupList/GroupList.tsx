'use client';

import { useState } from 'react';

import { GroupListType } from 'types/global.types';

import { nextGroupList } from 'app/actions/groups';

import { Links } from 'components/ui/atoms/Links/Links';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';
import { Tile } from 'components/ui/atoms/Tile/Tile';

import styles from './GroupList.module.css';

type GroupsType = {
  list: {
    title: string;
    all: string;
  };
  addingGroup: string;
  noGroups: string;
};

export const GroupList = ({ Groups, groupArray }: { Groups: GroupsType; groupArray: GroupListType[] }) => {
  const maxItems = 30;

  const [listArray, setListArray] = useState<GroupListType[]>(groupArray);
  const [lastVisible, setLastVisible] = useState(
    groupArray.length === maxItems ? groupArray[groupArray.length - 1].name : '',
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
        <article className={styles.titleContainer}>
          <h2 className={styles.title}>{Groups.list.title}</h2>
          <Links hrefLink="/adding_group" classLink={`${styles.addGroup__link} button`} aria-label={Groups.addingGroup}>
            {Groups.addingGroup}
          </Links>
        </article>
        <div className={styles.list}>
          {listArray.length > 0 ? (
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
