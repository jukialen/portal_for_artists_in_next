import { useEffect, useState } from 'react';
import { getDoc, getDocs } from 'firebase/firestore';
import { auth } from '../../../firebase';
import { Divider } from '@chakra-ui/react';

import { adminInGroups, user, groups } from 'references/referencesFirebase';

import { GroupType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { Links } from 'components/atoms/Links/Links';
import { Tile } from 'components/molecules/GroupTile/Tile';

import styles from './GroupUsers.module.scss';

export const GroupUsers = () => {
  const [adminsArray, setAdminsArray] = useState<GroupType[]>([]);
  const [moderatorsArray, setModeratorsArray] = useState<GroupType[]>([]);
  const [groupsArray, setGroupsArray] = useState<GroupType[]>([]);
  
  const currentUser = auth.currentUser?.uid;
  const data = useHookSWR();
  
  const downloadGroupsList = async () => {
    try {
      const querySnapshot = await getDocs(adminInGroups(currentUser!));
      
      const adminArray: GroupType[] = [];
      const moderatorArray: GroupType[] = [];
      const groupArray: GroupType[] = [];
      
      await querySnapshot.forEach((doc) =>  {
        adminArray.push({
          nameGroup: doc.data().name,
          logoUrl: doc.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`
        });
      });
      
      setAdminsArray(adminArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!currentUser && downloadGroupsList();
  }, []);
  
  return <div className={styles.tilesSection}>
    <div className={styles.container}>
      <Links
        hrefLink='/adding_group'
        classLink={`${styles.container__button} button`}
        aria-label={data?.Aside?.addingGroup}
      >
        {data?.Aside?.addingGroup}
      </Links>
    </div>
    <h2 className={styles.title}>{data?.Account?.groups?.adminTitle}</h2>
    <Divider className={styles.divider} />
    {adminsArray.length > 0 ? adminsArray.map(({ nameGroup, logoUrl }, index) => <Tile
      key={index}
      name={nameGroup}
      link={`/groups/${nameGroup}`}
      logoUrl={logoUrl}
    />) : <p className={styles.noGroups}>
      {data?.Account?.groups?.adminTitle}
    </p>}
    <h2 className={styles.title}>{data?.Account?.groups?.modsTitle}</h2>
    <Divider className={styles.divider} />
    {moderatorsArray.length > 0 ? moderatorsArray.map(({ nameGroup, logoUrl }, index) => <Tile
      key={index}
      name={nameGroup}
      link={`/groups/${nameGroup}`}
      logoUrl={logoUrl}
    />) : <p className={styles.noGroups}>
      {data?.Account?.groups?.noMods}
    </p>}
    <h2 className={styles.title}>{data?.Account?.groups?.usersTitle}</h2>
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
};