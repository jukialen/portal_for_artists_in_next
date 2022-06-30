import { useCallback, useState } from 'react';
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
  
  const downloadGroupsList = async () => {
    try {
      const querySnapshot = await getDocs(groupsQuery);
  
      const groupArray: GroupType[] = [];
      querySnapshot.forEach((doc) => {
         
        groupArray.push({
          logoUrl: doc.data().logo,
          nameGroup: doc.data().name,
          description: doc.data().description
        });
        // doc.data() is never undefined for query doc snapshots
        console.log('id', doc.id, ' => ', doc.data());
      });
      setGroupsArray(groupArray);
      console.log(groupArray);
    } catch (e) {
      console.log(e);
    }
  };
  
  useCallback(() => {
    console.log('a', groupsArray);
     return downloadGroupsList();
  }, [groupsArray, groupsQuery, user]);
  
  console.log('a2', groupsArray);
  
  return <div className={styles.tilesSection}>
      {/*<Image src='/friends.png' width={288} height={288} className={styles.thumbnail} alt='test' />*/}
      
      {/*<Links*/}
      {/*  hrefLink={`/${asPath}`}*/}
      {/*  title='test'*/}
      {/*  classLink={styles.link}*/}
      {/*/>*/}
      
      {groupsArray.map(({ nameGroup, logoUrl, description }) => <article className={styles.tile} key={nameGroup}>
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
      </article>)}
  </div>;
};