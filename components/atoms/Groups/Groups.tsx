import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { auth } from '../../../firebase';
import { getDoc } from 'firebase/firestore';

import { user, usersInGroup } from 'references/referencesFirebase';

import { DataType, GroupType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';
import { Button } from '@chakra-ui/react';

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
            groupList.push({ nameGroup: favorite, logoUrl: !!favoriteList.data().logo  ? favoriteList.data().logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`})
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
  }, [currentUser]);
  
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
        groupsArray.length > 0 ? groupsArray.map(({ nameGroup, logoUrl, description }, index) =>
          <div className={styles.groups__container} key={index}>
            <img src={logoUrl} alt={`${nameGroup} logo`} />
            <Links
              hrefLink={`/groups/${nameGroup}`}
              classLink={styles.groups__item}
              arial-label={description}
            >
              <h4>{nameGroup}</h4>
            </Links>
          </div>) : <p className={styles.no__groups}>{data?.Groups?.noGroups}</p>
      }
      <Button colorScheme='orange' borderColor='transparent' className={styles.listButton} variant='ghost'>
        <Link href='/groups/list' aria-label='all group link'>
          <a>All groups</a>
        </Link>
      </Button>
    </div>
  );
};
