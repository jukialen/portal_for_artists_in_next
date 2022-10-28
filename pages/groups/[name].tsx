import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UploadTaskSnapshot } from '@firebase/storage';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  getDoc,
  getDocs,
  query as qFire,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
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
  useDisclosure,
} from '@chakra-ui/react';

import { deleteMembers, deleteModerators, groups, members, moderators, user } from 'references/referencesFirebase';

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

  const addingToGroup = { background: activeColor, color: '#000' };

  const addingToGroupOutline = { background: 'transparent', color: activeColor };

  const joinedUsers = async () => {
    try {
      const queryRef = qFire(members(name!), where('member', '==', user(currentUser!)));
      const querySnapshot = await getDocs(queryRef);

      for (const member of querySnapshot.docs) {
        !!member.data().member.id ? setUserId(member.data().member.id) : setUserId(null);
        !!member.data().member.id ? setJoin(true) : setJoin(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !loading && !!name && joinedUsers();
  }, [name, loading]);

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
    !loading && !!name && favoriteGroup();
  }, [name, loading]);

  const joinToGroup = async () => {
    try {
      const membersRef = qFire(members(name!), where('member', '==', user(currentUser!)));
      const memberSnapshot = await getDocs(membersRef);

      const moderatorsRef = qFire(moderators(name!), where('moderator', '==', user(currentUser!)));
      const moderatorSnapshot = await getDocs(moderatorsRef);

      if (join && !!userId) {
        for (const memberGroup of memberSnapshot.docs) {
          await deleteDoc(deleteMembers(name!, memberGroup.id!));
        }
        for (const moderatorGroup of moderatorSnapshot.docs) {
          await deleteDoc(deleteModerators(name!, moderatorGroup.id!));
        }
        await setDoc(user(currentUser!), { favoriteGroups: arrayRemove(name) }, { merge: true });
      } else {
        await addDoc(members(name!), { member: user(currentUser!) });
      }
      setJoin(!join);
    } catch (e) {
      console.error(e);
    }
  };

  const groupInfo = async () => {
    try {
      const docSnap = await getDoc(groups(name!));
      if (docSnap.exists()) {
        setAdmin(docSnap.data().admin);
        setDescription(docSnap.data().description);
        setLogo(!!docSnap.data().logo ? docSnap.data().logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !loading && !!name && groupInfo();
  }, [name, loading]);

  const addToFavorites = async () => {
    try {
      if (favorite) {
        await setDoc(user(currentUser!), { favoriteGroups: arrayRemove(name) }, { merge: true });
      } else {
        await setDoc(user(currentUser!), { favoriteGroups: arrayUnion(name) }, { merge: true });
      }
      setFavorite(!favorite);
    } catch (e) {
      console.log(e);
    }
  };

  const changeFile = (e: EventType) => {
    if (e.target.files?.[0]) {
      setNewLogo(e.target.files[0]);
      setRequired(false);
    } else {
      setNewLogo(null);
      setRequired(true);
    }
  };

  const updateLogo = async () => {
    try {
      const fileRef = await ref(storage, `groups/${name}/${newLogo?.name}`);

      const upload = uploadBytesResumable(fileRef, newLogo!);

      !!newLogo &&
        !required &&
        upload.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
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
          },
          (e) => {
            console.error(e);
            setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
          },
          async () => {
            const groupLogoURL = await getDownloadURL(fileRef);

            setLogoUrl(groupLogoURL);
            await updateDoc(groups(name!), { logo: groupLogoURL });

            setValuesFields(`${data?.AnotherForm?.uploadFile}`);
            setNewLogo(null);
            setRequired(false);
            return null;
          },
        );
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return null;
  }
  return (
    <>
      <HeadCom path={asPath} content={`"${name}" group website`} />

      <article className={styles.mainContainer}>
        <div className={styles.logo}>
          <img src={logo} alt={`${name} logo`} />
          {currentUser === admin && (
            <IconButton
              aria-label="update group logo"
              icon={<MdCameraEnhance />}
              colorScheme="yellow"
              className={styles.updateLogo}
              onClick={onOpen}
            />
          )}
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent backgroundColor="#2D3748" color={selectedColor} className={styles.modal}>
            <ModalHeader className={styles.header}>Update logo</ModalHeader>
            <ModalCloseButton color={selectedColor} borderColor="transparent" fontSize="md" />
            <ModalBody className={styles.modal}>
              <Input
                type="file"
                name="logo"
                id="logo"
                padding=".35rem 1rem"
                margin=".5rem auto 1.5rem"
                onChange={changeFile}
                borderColor={!newLogo && required ? '#bd0000' : '#4F8DFF'}
              />

              <p style={{ color: '#bd0000' }}>{!newLogo && required && data?.NavForm?.validateRequired}</p>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="preview new logo"
                  width={192}
                  height={192}
                  style={{
                    margin: '1rem auto',
                    display: 'flex',
                    justifyContent: 'center',
                    borderRadius: '1rem',
                  }}
                />
              )}

              {progressUpload >= 1 && !(valuesFields === `${data?.AnotherForm?.uploadFile}`) && (
                <Progress
                  value={progressUpload}
                  colorScheme="green"
                  isAnimated
                  hasStripe
                  min={0}
                  max={100}
                  w={280}
                  bg="blue.400"
                  m="1.5rem auto"
                  size="md"
                />
              )}

              {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" borderColor="transparent" mr={3} onClick={onClose}>
                {data?.DeletionFile?.cancelButton}
              </Button>
              <Button onClick={updateLogo} colorScheme="yellow" borderColor="transparent">
                {data?.Description?.submit}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <h2 className={styles.nameGroup}>{name}</h2>
      </article>

      {admin === currentUser && (
        <div className={styles.buttons}>
          <Button
            leftIcon={join ? <CheckIcon boxSize={checkIcon} /> : <SmallAddIcon boxSize={smallIcon} />}
            style={join ? addingToGroupOutline : addingToGroup}
            colorScheme="blue"
            onClick={joinToGroup}
            variant={join ? 'outline' : 'solid'}
            className={styles.button}>
            {join ? data?.Groups?.joined : data?.Groups?.join}
          </Button>

          {join && (
            <div>
              <Button
                leftIcon={favorite ? <CheckIcon boxSize={checkIcon} /> : <SmallAddIcon boxSize={smallIcon} />}
                style={favorite ? addingToGroupOutline : addingToGroup}
                colorScheme="blue"
                disabled={!favorite && favoriteLength === 5}
                onClick={addToFavorites}
                variant={favorite ? 'solid' : 'outline'}
                className={`${styles.button} ${styles.favoriteButton}`}>
                {favorite ? data?.Groups?.favorite?.addedToFav : data?.Groups?.favorite?.addToFavorite}
              </Button>
              {!favorite && (
                <p>{favoriteLength !== 5 ? data?.Groups?.favorite?.maxFav : data?.Groups?.favorite?.maximumAchieved}</p>
              )}
            </div>
          )}
        </div>
      )}

      {admin !== currentUser && <Divider orientation="horizontal" />}

      <Tabs className={styles.tabs} isLazy lazyBehavior="keepMounted" isFitted variant="unstyled">
        <TabList className={styles.tablist}>
          <Tab
            _hover={{ borderColor: hoverColor }}
            _active={{ borderColor: activeColor }}
            _selected={{ borderColor: selectedColor }}
            borderColor={activeColor}
            className={styles.tab}>
            {decodeURIComponent(data?.Account?.aMenu?.general)}
          </Tab>
          <Tab
            _selected={{ borderColor: selectedColor }}
            _hover={{ borderColor: hoverColor }}
            _active={{ borderColor: activeColor }}
            borderColor={activeColor}
            className={styles.tab}>
            {decodeURIComponent(data?.Groups?.menu?.members)}
          </Tab>
          <Tab
            _selected={{ borderColor: selectedColor }}
            _hover={{ borderColor: hoverColor }}
            _active={{ borderColor: activeColor }}
            borderColor={activeColor}
            className={styles.tab}>
            {decodeURIComponent(data?.AnotherForm?.description)}
          </Tab>
        </TabList>

        <TabPanels padding={0}>
          <TabPanel padding={0}>
            <>
              {join && <AddingPost nameGroup={name} />}
              {join ? (
                <Posts nameGroup={name} currentUser={currentUser} />
              ) : (
                <p className={styles.noPermission}>{data?.Groups?.noPermission}</p>
              )}
            </>
          </TabPanel>
          <TabPanel padding={0}>
            <Members admin={admin} name={name!} />
          </TabPanel>
          <TabPanel padding={0}>
            <DescriptionSection description={description} admin={admin} name={name} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
