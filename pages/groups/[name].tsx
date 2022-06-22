import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { auth, db } from '../../firebase';
import { addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Button, Divider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { deleteUserFromGroup, groupSection, usersInGroup } from 'references/referencesFirebase';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AddingPost } from 'components/atoms/AddingPost/AddingPost';
import { Posts } from 'components/organisms/Posts/Posts';

import styles from './index.module.scss';
import group from 'public/group.svg';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';

export default function Groups() {
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [join, setJoin] = useState(false);
  
  const { query, asPath } = useRouter();
  const { name } = query;
  
  const user = auth.currentUser;
  
  const userId = user?.uid;
  
  const joinToGroup = async () => {
    try {
      console.log(join)
      if (join) {
        const querySnapshot = await getDocs(deleteUserFromGroup(name!, userId));
        querySnapshot.forEach( (document) => {
          console.log(document.id, ' => ', document.data());
          deleteDoc(doc(db, `groups/${name}/users/${document.id}`));
          setJoin(false);
          console.log('after', join)
        });
      } else {
        await addDoc(usersInGroup(name!), { username: userId });
        await setJoin(true);
        console.log('after', join)
      };
      
    } catch (e) {
      console.error(e);
    }
  };
  
  const groupInfo = async () => {
    try {
      const querySnapshot = await getDocs(groupSection(name!));
      querySnapshot.forEach((doc) => {
        
        setDescription(doc.data().description);
        setLogo(doc.data().logo);
      });
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    groupInfo();
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
      leftIcon={join ? <SmallAddIcon boxSize='1.5rem' /> : <CheckIcon boxSize='1rem' />}
      style={join ? addingToGroup : addingToGroupOutline}
      colorScheme='blue'
      onClick={joinToGroup}
      variant={join ? 'solid' : 'outline'}
      width='min-content'
      margin='0 2rem 1rem'
      className={styles.button}
    >
      {join ? 'Dołącz' : 'Dołączyłeś/aś'}
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
            <AddingPost name={name!} />
            <Posts />
          </>
        </TabPanel>
        <TabPanel padding={0}>
          bbbbddddddddd
        </TabPanel>
        <TabPanel padding={0}>
          <h2>Description: {description}</h2>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </>;
}