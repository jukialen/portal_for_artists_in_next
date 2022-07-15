import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getDoc, getDocs } from 'firebase/firestore';
import { auth } from '../../../firebase';

import { user, usersInGroup, groupsQuery} from 'references/referencesFirebase';

import { GroupType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './GroupUsers.module.scss';
import { Divider } from '@chakra-ui/react';

export const GroupUsers = () => {
  const [adminsArray, setAdminsArray] = useState<GroupType[]>([]);
  const [moderatorsArray, setModeratorsArray] = useState<GroupType[]>([]);
  const [groupsArray, setGroupsArray] = useState<GroupType[]>([]);
  
  const currentUser = auth.currentUser?.uid;
  
  const sizes = 288;
  
  const downloadGroupsList = async () => {
    try {
      const docSnap = await getDoc(user(currentUser!));
      const querySnapshot = await getDocs(groupsQuery(currentUser!));
      
      const adminArray: GroupType[] = [];
      const moderatorArray: GroupType[] = [];
      const groupArray: GroupType[] = [];
      
      await querySnapshot.forEach((doc) =>  {
        adminArray.push({ nameGroup: doc.data().name, logoUrl: doc.data().logo })
      });
      
      setAdminsArray(adminArray);
  
      if (docSnap.exists()) {
        const groups = docSnap.data().groups;
        groups.sort();
        
        for (const group of groups) {
          const groupData = await getDoc(usersInGroup(group));
          
          if (groupData.exists()) {
            const logoUrl: string = groupData.data().logo || '/#';
            
            groupArray.push({ nameGroup: group, logoUrl });
            
            for (const moderator of groupData.data().moderators) {
              currentUser === moderator && moderatorArray.push({ nameGroup: group, logoUrl });
            }
          }
        }
        setModeratorsArray(moderatorArray);
        setGroupsArray(groupArray);
      } else {
        console.log('No your groups!');
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!currentUser && downloadGroupsList();
  }, []);
  
  return <div className={styles.tilesSection}>
    <h2 className={styles.title}>Groups which you've created</h2>
    <Divider className={styles.divider} />
    {adminsArray.length > 0 ? adminsArray.map(({ nameGroup, logoUrl }) => <article
      className={styles.tile}
      key={nameGroup}
    >
      <Links
        hrefLink={`/groups/${nameGroup}`}
        classLink={styles.link}
      >
        <Image
          src={logoUrl}
          width={sizes}
          height={sizes}
          className={styles.thumbnail}
          alt={nameGroup}
        />
        <p className={styles.nameGroup}>{nameGroup}</p>
      </Links>
    </article>) : <p className={styles.noGroups}>
      You're not admin in any group.
    </p>}
    <h2 className={styles.title}>Groups which you manage</h2>
    <Divider className={styles.divider} />
    {moderatorsArray.length > 0 ? moderatorsArray.map(({ nameGroup, logoUrl }) => <article
      className={styles.tile}
      key={nameGroup}
    >
      <Links
        hrefLink={`/groups/${nameGroup}`}
        classLink={styles.link}
      >
        <Image
          src={logoUrl}
          width={sizes}
          height={sizes}
          className={styles.thumbnail}
          alt={nameGroup}
        />
        <p className={styles.nameGroup}>{nameGroup}</p>
      </Links>
    </article>) : <p className={styles.noGroups}>
      You're not moderators in any group.
    </p>}
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <h2 className={styles.title}>Groups you've joined</h2>
    <Divider className={styles.divider} />
    {groupsArray.length > 0 ? groupsArray.map(({ nameGroup, logoUrl }) => <article
      className={styles.tile}
      key={nameGroup}
    >
      <Links
        hrefLink={`/groups/${nameGroup}`}
        classLink={styles.link}
      >
        <Image
          src={logoUrl}
          width={sizes}
          height={sizes}
          className={styles.thumbnail}
          alt={nameGroup}
        />
        <p className={styles.nameGroup}>{nameGroup}</p>
      </Links>
    </article>) : <p className={styles.noGroups}>
      You didn't join to any group.
    </p>}
  </div>;
};