import { useEffect, useState } from 'react';
import { getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';

import { groupRef } from 'references/referencesFirebase';

import { GroupType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/molecules/GroupTile/Tile';

import styles from './index.module.scss';

export default function List() {
  const [listArray, setListArray] = useState<GroupType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);
  
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  const maxItems = 30;
  
  const downloadGroupsList = async () => {
    const queryFirst = query(groupRef, orderBy('name'), limit(maxItems));
    const groupList = await getDocs(queryFirst);
  
    const grLArray: GroupType[] = [];
  
    groupList.forEach(doc => grLArray.push({
      nameGroup: doc.data().name,
      logoUrl: doc.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`
    }));
    grLArray.length === maxItems && setLastVisible(groupList.docs[groupList.docs.length - 1]);
    setListArray(grLArray);
  };
  
  useEffect(() => {
    !loading && downloadGroupsList();
  }, [loading]);
  
  const downloadNextGroupsList = async () => {
    const queryNext = query(groupRef, orderBy('name'), startAfter(lastVisible), limit(maxItems));
    const groupList = await getDocs(queryNext);
    
    const grLArray: GroupType[] = [];
    
    groupList.forEach(doc => grLArray.push({
      nameGroup: doc.data().name,
      logoUrl: doc.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/groups.png`
    }));
  
    setListArray(listArray.concat(...grLArray));
    setLastVisible(groupList.docs[groupList.docs.length - 1]);
    setI(++i);
  };
  
  if (loading) { return null };
  
  return <section className={styles.container}>
    <div className={styles.container__section}>
      <h2 className={styles.title}>{data?.Groups?.list?.title}</h2>
      <div className={styles.list}>
        {
          listArray.length > 0
            ? listArray.map(({ nameGroup, logoUrl }, index) => <Tile
              key={index}
              name={nameGroup}
              link={`/groups/${nameGroup}`}
              logoUrl={logoUrl}
            />)
            : <p>{data?.Groups?.noGroups}</p>
        }
      </div>
    </div>
    {
      !!lastVisible && listArray.length === maxItems * i
        ? <MoreButton nextElements={downloadNextGroupsList} />
        : <p className={styles.noALl}>{data?.Groups?.list?.all}</p>
    }
  </section>;
}