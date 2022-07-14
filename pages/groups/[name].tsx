import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { auth } from '../../firebase';
import { arrayRemove, arrayUnion, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { Button, Divider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { groupSection, user, usersInGroup } from 'references/referencesFirebase';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AddingPost } from 'components/atoms/AddingPost/AddingPost';
import { Members } from 'components/atoms/Members/Members';
import { DescriptionSection } from 'components/atoms/DescriptionSection/DescriptionSection';
import { Posts } from 'components/organisms/Posts/Posts';

import styles from './index.module.scss';
import group from 'public/group.svg';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';

export default function Groups() {
  const [admin, setAdmin] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [moderators, setModerators] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [join, setJoin] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteLength, setFavoriteLength] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  
  const { query, asPath } = useRouter();
  const { name } = query;
  const currentUser = auth.currentUser?.uid;
  
  const favoriteGroup = async () => {
    try {
      const docSnap = await getDoc(user(currentUser!));
      
      if (docSnap.exists()) {
        docSnap.data().favoriteGroups.forEach((favoriteGroup: string) => {
          favoriteGroup === name ? setFavorite(true) : setFavorite(false);
        });
        setFavoriteLength(docSnap.data().favoriteGroups.length);
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!name && favoriteGroup();
  }, [name, join]);
  
  const joinedUsers = async () => {
    try {
      const docSnap = await getDoc(usersInGroup(name!));
      
      if (docSnap.exists()) {
        (docSnap.data().users).forEach((user: string) => {
          !!user ? setUserId(user) : setUserId(null);
          !!user ? setJoin(true) : setJoin(false);
        });
      } else {
        console.log('No join to group!');
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!name && joinedUsers();
  }, [name]);
  
  const joinToGroup = async () => {
    try {
      if (join && !!userId) {
        await setDoc(usersInGroup(name!),
          { users: arrayRemove(currentUser) },
          { merge: true });
        await setDoc(user(currentUser!),
          { groups: arrayRemove(name) },
          { merge: true });
      } else {
        await setDoc(usersInGroup(name!),
          { users: arrayUnion(currentUser) },
          { merge: true });
        await setDoc(user(currentUser!),
          { groups: arrayUnion(name) },
          { merge: true });
      }
      setJoin(!join);
    } catch (e) {
      console.error(e);
    }
  };
  
  const addToFavorites = async () => {
    try {
      if (favorite) {
        await setDoc(user(currentUser!), {
          favoriteGroups: arrayRemove(name)
        }, { merge: true });
      } else {
        await setDoc(user(currentUser!), {
          favoriteGroups: arrayUnion(name)
        }, { merge: true });
      }
      setFavorite(!favorite);
      
    } catch (e) {
      console.log(e);
    }
  };
  
  const groupInfo = async () => {
    try {
      const querySnapshot = await getDocs(groupSection(name!));
      querySnapshot.forEach((doc) => {
        setAdmin(doc.data().admin);
        setDescription(doc.data().description);
        setLogo(doc.data().logo);
        setModerators(doc.data().moderators);
        setUsers(doc.data().users);
      });
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!name && groupInfo();
  }, [name]);
  
  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#4F8DFF';
  const image = '180';
  
  const addingToGroup = {
    background: activeColor,
    color: '#000',
  };
  
  const addingToGroupOutline = {
    background: 'transparent',
    color: activeColor,
  };
  
  return <>
    <HeadCom path={asPath} content={`"${name}" group website`} />
    
    <article className={styles.mainContainer}>
      <div className={styles.logo}>
        <Image
          src={logo ? logo : group}
          width={image}
          height={image}
          alt={description}
        />
      </div>
      <h2 className={styles.nameGroup}>{name}</h2>
    </article>
    
    <div className={styles.buttons}>
      <Button
        leftIcon={join && currentUser === userId ? <CheckIcon boxSize='1rem' /> : <SmallAddIcon boxSize='1.5rem' />}
        style={join && currentUser === userId ? addingToGroupOutline : addingToGroup}
        colorScheme='blue'
        onClick={joinToGroup}
        variant={join && !!userId ? 'outline' : 'solid'}
        className={styles.button}
      >
        {join && currentUser === userId ? 'Dołączyłeś/aś' : 'Dołącz'}
      </Button>
      
      {(join && currentUser === userId) && <div>
        <Button
        leftIcon={favorite ? <CheckIcon boxSize='1rem' /> : <SmallAddIcon boxSize='1.5rem' />}
        style={favorite ? addingToGroupOutline : addingToGroup}
        colorScheme='blue'
        disabled={!favorite && favoriteLength > 5}
        onClick={addToFavorites}
        variant={favorite ? 'solid' : 'outline'}
        className={`${styles.button} ${styles.favoriteButton}`}
      >
        {favorite && currentUser === userId ? 'Ulubiona' : 'Dodaj do ulubionych'}
        </Button>
        <p>{favoriteLength > 5 ? 'Masz już 5 ulubionych grup' : 'Możesz dodać do 5 grup'}</p>
      </div>}
    </div>
    
    
    <Divider orientation='horizontal' />
    
    <Tabs
      className={styles.tabs}
      isLazy
      lazyBehavior='keepMounted'
      isFitted
      variant='unstyled'
    >
      <TabList className={styles.tablist}>
        <Tab
          _hover={{ borderColor: hoverColor }}
          _active={{ borderColor: activeColor }}
          _selected={{ borderColor: selectedColor }}
          borderColor={activeColor}
          className={styles.tab}
        >
          Ogólne
        </Tab>
        <Tab
          _selected={{ borderColor: selectedColor }}
          _hover={{ borderColor: hoverColor }}
          _active={{ borderColor: activeColor }}
          borderColor={activeColor}
          className={styles.tab}
        >
          Członkowie
        </Tab>
        <Tab
          _selected={{ borderColor: selectedColor }}
          _hover={{ borderColor: hoverColor }}
          _active={{ borderColor: activeColor }}
          borderColor={activeColor}
          className={styles.tab}
        >
          Opis
        </Tab>
      </TabList>
      
      <TabPanels padding={0}>
        <TabPanel padding={0}>
          <>
            { (join && currentUser === userId) && <AddingPost name={name} /> }
            <Posts name={name} currentUser={currentUser} />
          </>
        </TabPanel>
        <TabPanel padding={0}>
          <Members admin={admin} moderators={moderators} users={users} />
        </TabPanel>
        <TabPanel padding={0}>
          <DescriptionSection description={description} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </>;
}