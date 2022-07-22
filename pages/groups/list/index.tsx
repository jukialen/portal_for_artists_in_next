import { useEffect, useState } from 'react';
import { getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';
import { Button } from '@chakra-ui/react';

import { groupRef } from 'references/referencesFirebase';

import { GroupType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { GroupTile } from 'components/molecules/GroupTile/GroupTile';

import styles from './index.module.scss';

export default function List() {
  const [listArray, setListArray] = useState<GroupType[]>([]);
  let [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  
  const data = useHookSWR();
  
  const downloadGroupsList = async () => {
    const queryFirst = query(groupRef, orderBy('name'), limit(30));
    const groupList = await getDocs(queryFirst);
    
    const grLArray: GroupType[] = [];
    
    groupList.forEach(doc => grLArray.push({ nameGroup: doc.data().name, logoUrl: doc.data().logo }));
    
    grLArray.length === 30 && setLastVisible(groupList.docs[groupList.docs.length - 1]);
    setListArray(grLArray);
    
  };
  
  const downloadNextGroupsList = async () => {
    const queryNext = query(groupRef, orderBy('name'), startAfter(lastVisible), limit(30));
    const groupList = await getDocs(queryNext);
    
    const grLArray: GroupType[] = [];
    
    groupList.forEach(doc => grLArray.push({ nameGroup: doc.data().name, logoUrl: doc.data().logo }));
    
    setLastVisible(groupList.docs[groupList.docs.length - 1]);
    setListArray(listArray.concat(...grLArray));
  };
  
  useEffect(() => {
    downloadGroupsList().then(() => console.log('groups list'));
  }, []);
  
  
  return <>
    <h2 className={styles.title}>{data?.Groups?.list?.title}</h2>
    {
      listArray.length > 0
        ? listArray.forEach(({ nameGroup, logoUrl }) => <GroupTile
          key={nameGroup}
          nameGroup={nameGroup}
          logoUrl={logoUrl}
        />)
        : <p>{data?.Groups?.noGroups}</p>
    }
    
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
        : <p>{data?.Groups?.list?.all}</p>
    }
  </>;
}