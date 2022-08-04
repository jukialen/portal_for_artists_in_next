import { useEffect, useState } from 'react';
import { getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';
import { Button } from '@chakra-ui/react';

import { groupRef } from 'references/referencesFirebase';

import { GroupType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { GroupTile } from 'components/molecules/GroupTile/GroupTile';

import styles from './index.module.scss';

export default function List() {
  const [listArray, setListArray] = useState<GroupType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  
  const downloadGroupsList = async () => {
    const queryFirst = query(groupRef, orderBy('name'), limit(30));
    const groupList = await getDocs(queryFirst);
  
    const grLArray: GroupType[] = [];
  
    groupList.forEach(doc => grLArray.push({
      nameGroup: doc.data().name,
      logoUrl: doc.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`
    }));
    grLArray.length === 30 && setLastVisible(groupList.docs[groupList.docs.length - 1]);
    setListArray(grLArray);
  };
  
  useEffect(() => {
    !loading && downloadGroupsList();
  }, [loading]);
  
  const downloadNextGroupsList = async () => {
    const queryNext = query(groupRef, orderBy('name'), startAfter(lastVisible), limit(30));
    const groupList = await getDocs(queryNext);
    
    const grLArray: GroupType[] = [];
    
    groupList.forEach(doc => grLArray.push({
      nameGroup: doc.data().name,
      logoUrl: doc.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/groups.png`
    }));
    
    setLastVisible(groupList.docs[groupList.docs.length - 1]);
    setListArray(listArray.concat(...grLArray));
  };
  
  if (loading) {
    return null;
  }
  
  return <section className={styles.container}>
    <h2 className={styles.title}>{data?.Groups?.list?.title}</h2>
    {console.log(listArray)}
    <div className={styles.list}>
      {
        listArray.length > 0
          ? listArray.map(({ nameGroup, logoUrl }) => <GroupTile
            key={nameGroup}
            nameGroup={nameGroup}
            logoUrl={logoUrl}
          />)
          : <p>{data?.Groups?.noGroups}</p>
      }
    </div>
    {
      !!lastVisible
        ? <Button
          colorScheme='blue'
          backgroundColor='#4F8DFF'
          color='#000'
          borderRadius='3xl'
          className={styles.more}
          onClick={downloadNextGroupsList}
        >
          {data?.Groups?.list?.more}
        </Button>
        : <p className={styles.noALl}>{data?.Groups?.list?.all}</p>
    }
  </section>;
}