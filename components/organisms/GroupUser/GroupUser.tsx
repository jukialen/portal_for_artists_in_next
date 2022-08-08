import styles from './GroupUser.module.scss';
import { useEffect, useState } from 'react';
import { getDoc, getDocs } from 'firebase/firestore';
import { Divider } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

import { GroupType } from 'types/global.types';

import { groupsQuery, user, usersInGroup } from 'references/referencesFirebase';

import { Tile } from 'components/molecules/GroupTile/Tile';

type GroupUserType = {
  uidUser: string;
}

export const GroupUser = ({ uidUser }: GroupUserType) => {
  const [adminsArray, setAdminsArray] = useState<GroupType[]>([]);
  const [moderatorsArray, setModeratorsArray] = useState<GroupType[]>([]);
  const [groupsArray, setGroupsArray] = useState<GroupType[]>([]);
  
  const data = useHookSWR();
  
  const downloadGroupsList = async () => {
    try {
      const docSnap = await getDoc(user(uidUser));
      const querySnapshot = await getDocs(groupsQuery(uidUser));
      
      const adminArray: GroupType[] = [];
      const moderatorArray: GroupType[] = [];
      const groupArray: GroupType[] = [];
      
      await querySnapshot.forEach((doc) =>  {
        adminArray.push({ nameGroup: doc.data().name, logoUrl: doc.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg}` })
      });
      
      setAdminsArray(adminArray);
      
      if (docSnap.exists()) {
        const groups = docSnap.data().groups;
        groups.sort();
        
        for (const group of groups) {
          const groupData = await getDoc(usersInGroup(group));
          
          if (groupData.exists()) {
            const logoUrl: string = groupData.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg}`;
            
            groupArray.push({ nameGroup: group, logoUrl });
            
            for (const moderator of groupData.data().moderators) {
              uidUser === moderator && moderatorArray.push({ nameGroup: group, logoUrl });
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
    !!uidUser && downloadGroupsList();
  }, []);
  
  return <div className={styles.tilesSection}>
    <h2 className={styles.title}>{data?.groupsUser?.adminTitle}</h2>
    <Divider className={styles.divider} />
    {adminsArray.length > 0 ? adminsArray.map(({ nameGroup, logoUrl }, index) => <Tile
      key={index}
      name={nameGroup}
      link={`/groups/${nameGroup}`}
      logoUrl={logoUrl}
    />) : <p className={styles.noGroups}>
      {data?.Account?.groups?.adminTitle}
    </p>}
    <h2 className={styles.title}>{data?.groupsUser?.modsTitle}</h2>
    <Divider className={styles.divider} />
    {moderatorsArray.length > 0 ? moderatorsArray.map(({ nameGroup, logoUrl }, index) => <Tile
      key={index}
      name={nameGroup}
      link={`/groups/${nameGroup}`}
      logoUrl={logoUrl}
    />) : <p className={styles.noGroups}>
      {data?.Account?.groups?.noMods}
    </p>}
    <h2 className={styles.title}>{data?.groupsUser?.usersTitle}</h2>
    <Divider className={styles.divider} />
    {groupsArray.length > 0 ? groupsArray.map(({ nameGroup, logoUrl }, index) => <Tile
      key={index}
      name={nameGroup}
      link={`/groups/${nameGroup}`}
      logoUrl={logoUrl}
    />) : <p className={styles.noGroups}>
      {data?.Account?.groups?.noUsers}
    </p>}
  </div>;
}