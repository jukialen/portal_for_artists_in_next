import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UploadTaskSnapshot } from '@firebase/storage';
import { arrayRemove, arrayUnion, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import {
  Button,
  Divider,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure
} from '@chakra-ui/react';

import { groupSection, user, usersInGroup } from 'references/referencesFirebase';

import { EventType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AddingPost } from 'components/molecules/AddingPost/AddingPost';
import { Members } from 'components/atoms/Members/Members';
import { DescriptionSection } from 'components/molecules/DescriptionSection/DescriptionSection';
import { Posts } from 'components/organisms/Posts/Posts';

import styles from './index.module.scss';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';
import { MdCameraEnhance } from 'react-icons/md';

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
  
  const [required, setRequired] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { query, asPath } = useRouter();
  const { name } = query;
  const currentUser = auth.currentUser?.uid;
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  
  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#4F8DFF';
  const checkIcon = '1rem';
  const smallIcon = '1.5rem';
  
  const addingToGroup = {
    background: activeColor,
    color: '#000',
  };
  
  const addingToGroupOutline = {
    background: 'transparent',
    color: activeColor,
  };
  
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
    };
  };
  
  useEffect(() => {
    !loading && !!name && favoriteGroup();
  }, [name, loading]);
  
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
    !loading && !!name && joinedUsers();
  }, [name, loading]);
  
  const joinToGroup = async () => {
    try {
      if (join && !!userId) {
        await setDoc(usersInGroup(name!),
          { users: arrayRemove(currentUser) },
          { merge: true });
        await setDoc(user(currentUser!),
          { groups: arrayRemove(name), favoriteGroups: arrayRemove(name) },
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
        setLogo(!!doc.data().logo ? doc.data().logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`);
        setModerators(doc.data().moderators);
        setUsers(doc.data().users);
      });
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !loading && !!name && groupInfo();
  }, [name, loading]);
  
  const changeFile = (e: EventType) => {
    if (e.target.files?.[0]) {
      setNewLogo(e.target.files[0]);
      setRequired(false);
    } else {
      setNewLogo(null);
      setRequired(true)
    }
  };
  
  const updateLogo = async () => {
    try {
      const fileRef = await ref(storage, `groups/${name}/${newLogo?.name}`);
  
      const upload = uploadBytesResumable(fileRef, newLogo!);
  
      !!newLogo && !required && upload.on('state_changed', (snapshot: UploadTaskSnapshot) => {
          const progress: number = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressUpload(progress);
          switch (snapshot.state) {
            case 'running':
              setValuesFields('Upload is running');
              break;
            case 'paused':
              setValuesFields('Upload is paused');
              break;
          }
        }, (e) => {
          console.error(e);
          setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
        },
        async () => {
          const groupLogoURL = await getDownloadURL(fileRef);

          setLogoUrl(groupLogoURL);
          await updateDoc(usersInGroup(name!), { logo: groupLogoURL });

          setValuesFields(`${data?.AnotherForm?.uploadFile}`);
          setNewLogo(null);
          setRequired(false);
          return null;
        });
    } catch (e) {
      console.log(e);
    }
  };
  
  return !loading ? <>
    <HeadCom path={asPath} content={`"${name}" group website`} />
    
    <article className={styles.mainContainer}>
      <div className={styles.logo}>
        <img src={logo} alt={`${name} logo`} />
        {currentUser === admin &&
        <IconButton
          aria-label='update group logo'
          icon={<MdCameraEnhance />}
          colorScheme='yellow'
          className={styles.updateLogo}
          onClick={onOpen}
        />}
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent backgroundColor='#2D3748' color={selectedColor} className={styles.modal}>
          <ModalHeader className={styles.header}>Update logo</ModalHeader>
          <ModalCloseButton color={selectedColor} borderColor='transparent' fontSize='md' />
          <ModalBody className={styles.modal}>
            <Input
              type='file'
              name='logo'
              id='logo'
              padding='.35rem 1rem'
              margin='.5rem auto 1.5rem'
              onChange={changeFile}
              borderColor={!newLogo && required ? '#bd0000' : '#4F8DFF'}
            />
    
            <p style={{ color: '#bd0000' }}>
              {!newLogo && required && data?.NavForm?.validateRequired}
            </p>
            {logoUrl &&
            <img
              src={logoUrl}
              alt='preview new logo'
              width={192}
              height={192}
              style={{ margin: '1rem auto', display: 'flex', justifyContent: 'center', borderRadius: '1rem' }}
            />}
    
            {progressUpload >= 1 && !(valuesFields === `${data?.AnotherForm?.uploadFile}`) &&
            <Progress
              value={progressUpload}
              colorScheme='green'
              isAnimated
              hasStripe
              min={0}
              max={100}
              w={280}
              bg='blue.400'
              m='1.5rem auto'
              size='md'
            />
            }
    
            {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' borderColor='transparent' mr={3} onClick={onClose}>
              {data?.DeletionFile?.cancelButton}
            </Button>
            <Button
              onClick={updateLogo}
              colorScheme='yellow'
              borderColor='transparent'
            >
              {data?.Description?.submit}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <h2 className={styles.nameGroup}>{name}</h2>
    </article>
    
    <div className={styles.buttons}>
      <Button
        leftIcon={join && currentUser === userId ? <CheckIcon boxSize={checkIcon} /> : <SmallAddIcon boxSize={smallIcon} />}
        style={join && currentUser === userId ? addingToGroupOutline : addingToGroup}
        colorScheme='blue'
        onClick={joinToGroup}
        variant={join && !!userId ? 'outline' : 'solid'}
        className={styles.button}
      >
        {join && currentUser === userId ? data?.Groups?.joined : data?.Groups?.join}
      </Button>
      
      {(join && currentUser === userId) && <div>
        <Button
        leftIcon={favorite ? <CheckIcon boxSize={checkIcon} /> : <SmallAddIcon boxSize={smallIcon} />}
        style={favorite ? addingToGroupOutline : addingToGroup}
        colorScheme='blue'
        disabled={!favorite && favoriteLength === 5}
        onClick={addToFavorites}
        variant={favorite ? 'solid' : 'outline'}
        className={`${styles.button} ${styles.favoriteButton}`}
      >
        {favorite ? data?.Groups?.favorite?.addedToFav : data?.Groups?.favorite?.addToFavorite}
        </Button>
        {!favorite && <p>{favoriteLength !== 5 ? data?.Groups?.favorite?.maxFav : data?.Groups?.favorite?.maximumAchieved}</p>}
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
          {decodeURIComponent(data?.Account?.aMenu?.general)}
        </Tab>
        <Tab
          _selected={{ borderColor: selectedColor }}
          _hover={{ borderColor: hoverColor }}
          _active={{ borderColor: activeColor }}
          borderColor={activeColor}
          className={styles.tab}
        >
          {decodeURIComponent(data?.Groups?.menu?.members)}
        </Tab>
        <Tab
          _selected={{ borderColor: selectedColor }}
          _hover={{ borderColor: hoverColor }}
          _active={{ borderColor: activeColor }}
          borderColor={activeColor}
          className={styles.tab}
        >
          {decodeURIComponent(data?.AnotherForm?.description)}
        </Tab>
      </TabList>
      
      <TabPanels padding={0}>
        <TabPanel padding={0}>
          <>
            { (join && currentUser === userId) && <AddingPost nameGroup={name} /> }
            <Posts nameGroup={name} currentUser={currentUser} />
          </>
        </TabPanel>
        <TabPanel padding={0}>
          <Members admin={admin} moderators={moderators} users={users} />
        </TabPanel>
        <TabPanel padding={0}>
          <DescriptionSection description={description} admin={admin} name={name} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </> : null
}