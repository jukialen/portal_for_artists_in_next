import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';
import { getDoc } from 'firebase/firestore';
import { Button } from '@chakra-ui/react';

import { user, usersInGroup } from 'references/referencesFirebase';

import { DataType, GroupType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

export const Groups = ({ data }: DataType) => {
  const [groupsArray, setGroupsArray] = useState<GroupType[]>([]);
  const [open, setOpen] = useState(false);
  
  const { locale } = useRouter();
  
  const currentUser = auth.currentUser?.uid;
  const arrowIcons = '1.5rem';
  
  const changeOpenGroups = () => setOpen(!open);
  
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
            groupList.push({
              nameGroup: favorite,
              logoUrl: !!favoriteList.data().logo ? favoriteList.data().logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`
            });
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
      <h3 className={styles.title} onClick={changeOpenGroups}>
        <p className={locale === 'jp' ? styles.title__jp : ''}>
          {data?.Aside?.groups}
        </p>
        {open ? <TriangleUpIcon w={arrowIcons} h={arrowIcons} /> :
          <TriangleDownIcon w={arrowIcons} h={arrowIcons} />}
      </h3>
    
      <div className={open ? styles.groups__container : styles.hiddenGroups}>
        {
          groupsArray.length > 0 ? groupsArray.map(({ nameGroup, logoUrl, description }, index) =>
            <div className={styles.container} key={index}>
              <img src={logoUrl} alt={`${nameGroup} logo`} />
              <Links
                hrefLink={`/groups/${nameGroup}`}
                classLink={styles.container__item}
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
    </div>
  );
};
