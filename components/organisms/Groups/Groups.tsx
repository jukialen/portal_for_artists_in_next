import { useEffect, useState } from 'react';
import Image from 'next/image';
import { auth } from '../../../firebase';
import { getDocs } from 'firebase/firestore';

import { groupsInAside } from 'references/referencesFirebase';

import { DataType, GroupType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';
import group from 'public/group.svg';
import { useRouter } from 'next/router';

export const Groups = ({ data }: DataType) => {
  const [groupsArray, setGroupsArray] = useState<GroupType[]>([]);
  
  const user = auth.currentUser;
  
  const { asPath } = useRouter();
  
  const groupList = async () => {
    try {
      const groupList: GroupType[] = [];
      const querySnapshot = await getDocs(groupsInAside);
      
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
    !!user && groupList();
  }, [user, asPath]);
  
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
