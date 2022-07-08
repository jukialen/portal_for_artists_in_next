import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { auth } from '../../firebase';
import { arrayRemove, arrayUnion, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { Button, Divider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { groupSection, usersInGroup } from 'references/referencesFirebase';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AddingPost } from 'components/atoms/AddingPost/AddingPost';
import { Members } from 'components/atoms/Members/Members';
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
  const [userId, setUserId] = useState<string | null>(null);
  
  const { query, asPath } = useRouter();
  const { name } = query;
  const user = auth.currentUser;
  const currentUser = user?.uid;
  
  const joinedUsers = async () => {
    try {
      // @ts-ignore
      const docSnap = await getDoc(usersInGroup(name!));
      
      if (docSnap.exists()) {
        (docSnap.data().users).forEach((user: string) => {
          !!user ? setUserId(user) : setUserId(null);
          !!user ? setJoin(true) : setJoin(false);
        });
      } else {
        console.log('No such document!');
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    // @ts-ignore
    !!name && joinedUsers(name);
  }, [name, join]);
  
  const joinToGroup = async () => {
    try {
      if (join && !!userId) {
        // @ts-ignore
        await setDoc(usersInGroup(name!),
          { users: arrayRemove(currentUser) },
          { merge: true });
      } else {
        // @ts-ignore
        await setDoc(usersInGroup(name!),
          { users: arrayUnion(currentUser) },
          { merge: true });
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
          <Members
            admin={admin}
            moderators={!!moderators ? moderators.sort() : moderators}
            users={!!users ? users.sort() : users}
          />
        </TabPanel>
        <TabPanel padding={0}>
          <section className={styles.container__description}>
            <h2 className={styles.description__title}>Description</h2>
            <Divider />
            <p className={styles.description}>{description}</p>
            <h2 className={styles.description}>Regulamin</h2>
            <Divider />
            <p className={styles.regulations__item}>
              1) Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p className={styles.regulations__item}>
              2) Pellentesque scelerisque tortor nec ex mattis, non consectetur sapien imperdiet. Cras sed sem
              volutpat arcu gravida mattis non commodo ligula. Curabitur sed magna in nisi rutrum iaculis. Morbi sed
              nulla et odio finibus viverra a ac leo. Quisque a enim pharetra, cursus est ut, ullamcorper nibh.
            </p>
            <p className={styles.regulations__item}>
              3) Nam auctor sem eu ipsum consequat rutrum. Phasellus vel nulla sodales, finibus felis nec, ullamcorper
              metus.
            </p>
            <p className={styles.regulations__item}>
              4) Donec ac magna ac risus egestas semper eget vel purus. Curabitur luctus sem sed maximus tincidunt.
              Nullam efficitur leo quis pretium efficitur. Ut id ex eu odio tristique elementum.
            </p>
            <p className={styles.regulations__item}>
              5) Aliquam non nisi ac nulla commodo porta. Morbi id metus eget arcu dictum sodales eu at sapien.
            </p>
            <p className={styles.regulations__item}>
              6) Praesent quis justo non dolor tincidunt convallis pellentesque sit amet libero. Sed sit amet tortor
              tempus, viverra ex et, vestibulum justo. Pellentesque quis leo sed purus accumsan commodo. Duis varius
              lorem at justo rhoncus finibus. Phasellus in tellus a lacus accumsan blandit condimentum sed dolor.
            </p>
            <p className={styles.regulations__item}>
              7) Etiam id nulla a mi molestie ultrices et et neque. Quisque id ligula nec felis facilisis imperdiet.
            </p>
            <p className={styles.regulations__item}>
              8) Curabitur mattis dolor at pellentesque lobortis. Morbi vestibulum ante tincidunt, commodo metus non,
              placerat tortor. Duis mattis urna ut felis ultrices rhoncus.
            </p>
            <p className={styles.regulations__item}>
              9) Integer vel orci rutrum, malesuada risus non, lobortis est. Duis eleifend dui in quam commodo egestas.
            </p>
            <p className={styles.regulations__item}>
              10) Praesent vehicula nisl id mauris lobortis imperdiet. In facilisis neque a libero molestie, sed
              lacinia urna aliquam. Aenean sed dolor porta, venenatis dolor et, sollicitudin ante. Etiam at nisl eget
              libero lobortis faucibus.
            </p>
          </section>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </>;
}