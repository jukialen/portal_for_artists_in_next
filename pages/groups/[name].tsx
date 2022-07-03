import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { auth, db } from '../../firebase';
import { addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Button, Divider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { deleteUserFromGroup, groupSection, usersInGroup } from 'references/referencesFirebase';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AddingPost } from 'components/atoms/AddingPost/AddingPost';
import { Members } from 'components/atoms/Members/Members';
import { Posts } from 'components/organisms/Posts/Posts';

import styles from './index.module.scss';
import group from 'public/group.svg';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';

export default function Groups() {
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [join, setJoin] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  const { query, asPath } = useRouter();
  const { name } = query;
  const user = auth.currentUser;
  const currentUser = user?.uid;
  
  const joinToGroup = async () => {
    try {
      // @ts-ignore
      const querySnapshot = await getDocs(deleteUserFromGroup(name!, currentUser!));
      
      // @ts-ignore
      if (join && userId !== '') {
        querySnapshot.forEach((document) => deleteDoc(doc(db, `groups/${name}/users/${document.id}`)));
      } else {
        // @ts-ignore
        await addDoc(usersInGroup(name!), { username: currentUser });
      }
      setJoin(!join);
    } catch (e) {
      console.error(e);
    }
  };
  
  const groupInfo = async () => {
    try {
      // @ts-ignore
      const querySnapshot = await getDocs(groupSection(name!));
      querySnapshot.forEach((doc) => {
        setDescription(doc.data().description);
        setLogo(doc.data().logo);
      });
    } catch (e) {
      console.error(e);
    }
  };
  
  const users = async () => {
    try {
      // @ts-ignore
      const querySnapshot = await getDocs(deleteUserFromGroup(name!, currentUser!));
      
      querySnapshot.forEach((doc) => {
        !!doc.data().username ? setUserId(doc.data().username) : setUserId(null);
        !!doc.data().username ? setJoin(true) : setJoin(false);
      });
    }
    catch (e) {
      setJoin(false)
      console.error(e);
    }
  };
  
  useEffect(() => {
    // @ts-ignore
    !!name && users(name);
  }, [name]);
  
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
    
    <Button
      leftIcon={join && !!userId ? <CheckIcon boxSize='1rem' /> : <SmallAddIcon boxSize='1.5rem' />}
      style={join && !!userId ? addingToGroupOutline : addingToGroup}
      colorScheme='blue'
      onClick={joinToGroup}
      variant={join && !!userId ? 'outline' : 'solid'}
      width='min-content'
      margin='0 2rem 1rem'
      className={styles.button}
    >
      {join && !!userId ? 'Dołączyłeś/aś' : 'Dołącz'}
    </Button>
    
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
            {/*@ts-ignore*/}
            { (join && currentUser === userId) && <AddingPost name={name} /> }
            {/*@ts-ignore*/}
            <Posts name={name} join={join} currentUser={currentUser} />
          </>
        </TabPanel>
        <TabPanel padding={0}>
          <Members />
        </TabPanel>
        <TabPanel padding={0}>
          <h2>Description: {description}</h2>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </>;
}