import { useEffect, useState } from 'react';
import Image from 'next/image';
import { auth } from '../../../firebase';
import { getDoc } from 'firebase/firestore';

import { user, usersInGroup } from 'references/referencesFirebase';

import { DataType, GroupType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';
import group from 'public/group.svg';
import { useRouter } from 'next/router';

export const Groups = ({ data }: DataType) => {
  const [groupsArray, setGroupsArray] = useState<GroupType[]>([]);
  
  const currentUser = auth.currentUser?.uid;
  
  const { asPath } = useRouter();
  
  const groupList = async () => {
    try {
      const groupList: GroupType[] = [];
      const docSnap = await getDoc(user(currentUser!));
  
      if (docSnap.exists()) {
        const favorites = docSnap.data().favoriteGroups;
        favorites.sort();
    
        for (const favorite of favorites) {
          const favoriteList = await getDoc(usersInGroup(favorite));
      
          if (favoriteList.exists()) {
            const logoUrl: string = favoriteList.data().logo || '/#';
        
            groupList.push({ nameGroup: favorite, logoUrl });
          }
        }
        setGroupsArray(groupList);
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  useEffect(() => {
    !!currentUser && groupList();
  }, [currentUser, asPath]);
  
  return (
    <div className={styles.groups}>
      <Links
        hrefLink='/adding_group'
        classLink={`${styles.groups__button} button`}
        aria-label={data?.Aside?.addingGroup}
      >
        {data?.Aside?.addingGroup}
      </Links>
      
      {
        groupsArray.length > 0 ? groupsArray.map(({ nameGroup, logoUrl, description }) =>
          <div className={styles.groups__container} key={nameGroup}>
            <Image src={!!logoUrl ? logoUrl : group} alt={description} width={38} height={38} />
            <Links
              hrefLink={`/groups/${nameGroup}`}
              classLink={styles.groups__item}
              arial-label={description}
            >
              <h4>{nameGroup}</h4>
            </Links>
          </div>) : <p className={styles.no__groups}>{data?.Groups?.noGroups}</p>
      }
    </div>
  );
};
