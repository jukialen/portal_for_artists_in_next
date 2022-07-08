import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { getDocs } from 'firebase/firestore';
import { auth } from '../../../firebase';

import { groupsQuery } from 'references/referencesFirebase';

import { Links } from 'components/atoms/Links/Links';

import styles from './GroupUsers.module.scss';

import { GroupType } from 'types/global.types';

export const GroupUsers = () => {
  const [groupsArray, setGroupsArray] = useState<GroupType[]>([]);
  
  const user = auth.currentUser;
  const currentUser = user?.uid;
  
  const downloadGroupsList = async () => {
    try {
      const querySnapshot = await getDocs(groupsQuery(currentUser!));

      const groupArray: GroupType[] = [];
      querySnapshot.forEach((doc) => {
        groupArray.push({
          logoUrl: doc.data().logo,
          nameGroup: doc.data().name,
          description: doc.data().description
        });
        console.log(groupArray)
      });
      setGroupsArray(groupArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
     !!currentUser && downloadGroupsList()
  }, [currentUser]);
  
  console.log(groupsArray);
  
  return <div className={styles.tilesSection}>
      {groupsArray.length > 0 ? groupsArray.map(({ nameGroup, logoUrl, description }) => <article className={styles.tile} key={nameGroup}>
        <Image
        src={logoUrl}
        width={288}
        height={288}
        className={styles.thumbnail}
        alt={description}
      />
        
        <Links
          hrefLink={`/my-groups/${logoUrl}`}
          title={nameGroup}
          classLink={styles.link}
        />
      </article>) : <p>No groups</p>}
  </div>;
};