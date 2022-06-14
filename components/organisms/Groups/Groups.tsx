import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getDocs } from 'firebase/firestore';

import { groupRef } from 'references/referencesFirebase';

import { DataType, GroupType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';
import group from 'public/group.svg';

export const Groups = ({ data }: DataType) => {
  const [groupsArray, setGroupsArray] = useState<GroupType[]>([]);
  
  const groupList = async () => {
    try {
      const groupList: GroupType[] = [];
      const querySnapshot = await getDocs(groupRef);
      
      querySnapshot.forEach((doc) => {
        groupList.push({
          description: doc.data().description,
          logoUrl: doc.data().logo,
          nameGroup: doc.data().name
        });
        setGroupsArray(groupList);
      });
    } catch (e) {
      console.log(e);
    }
  };
  
  useEffect(() => {
    groupList();
  }, []);
  
  return (
    <div className={styles.groups}>
      <Links
        hrefLink='/adding_group'
        title={data?.Aside?.addingGroup}
        classLink={`${styles.groups__button} button`}
        aria-label={data?.Aside?.addingGroup}
      />
      
      {
        groupsArray.length > 0 ? groupsArray.map(({ nameGroup, logoUrl, description }) =>
          <div className={styles.groups__container} key={nameGroup}>
            <Image src={!!logoUrl ? logoUrl : group} alt={description} width={38} height={38} />
            <Links
              hrefLink={`/groups/${nameGroup}`}
              classLink={styles.groups__item}
              elementLink={<h4>{nameGroup}</h4>}
              arial-label={description}
            />
          </div>) : <p className={styles.no__groups}>Brak grup</p>
      }
    </div>
  );
};
