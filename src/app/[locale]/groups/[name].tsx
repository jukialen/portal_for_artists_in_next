import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
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

import { EventType, GroupType, Role } from 'src/types/global.types';

<<<<<<<< Updated upstream:pages/groups/[name].tsx
import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useUserData } from 'hooks/useUserData';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AddingPost } from 'components/molecules/AddingPost/AddingPost';
import { Members } from 'components/atoms/Members/Members';
import { DescriptionSection } from 'components/molecules/DescriptionSection/DescriptionSection';
import { Posts } from 'components/organisms/Posts/Posts';
========
import { backUrl, cloudFrontUrl } from 'src/constants/links';

import { useUserData } from 'src/hooks/useUserData';

import { Alerts } from 'src/components/atoms/Alerts/Alerts';

import { AddingPost } from 'src/components/molecules/AddingPost/AddingPost';
import { Members } from 'src/components/atoms/Members/Members';
import { DescriptionSection } from 'src/components/molecules/DescriptionSection/DescriptionSection';
import { Posts } from 'src/components/organisms/Posts/Posts';
>>>>>>>> Stashed changes:source/app/[locale]/groups/[name].tsx

import styles from './index.module.scss';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';
import { MdCameraEnhance } from 'react-icons/md';

export default function Groups() {
  const [admin, setAdmin] = useState(false);
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [join, setJoin] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteLength, setFavoriteLength] = useState(0);
  const [usersGroupsId, setUsersGroupsId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [regulation, setRegulation] = useState('');

  const [required, setRequired] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { query, asPath } = useRouter();
  const { name } = query;
  const data = useHookSWR();
  const { plan } = useUserData();

  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#4F8DFF';
  const checkIcon = '1rem';
  const smallIcon = '1.5rem';
  const zeroPadding = 0;

  const addingToGroup = { background: activeColor, color: '#000' };

  const addingToGroupOutline = { background: 'transparent', color: activeColor };

  const joinedUsers = async () => {
    try {
      const groups: { data: GroupType } = await axios.get(`${backUrl}/groups/${name}`);
      setLogo(`https://${cloudFrontUrl}/${groups.data.logo}`);
      setDescription(groups.data.description!);
      setRegulation(groups.data.regulation);

      if (!!groups) {
        setJoin(true);
        setFavorite(groups.data.favorited!);
        setFavoriteLength(groups.data.favorites!);
        setAdmin(groups.data.role === 'ADMIN');
        setGroupId(groups.data.groupId!);
        setRoleId(groups.data.roleId!);
        setUsersGroupsId(groups.data.usersGroupsId!);
      } else {
        setJoin(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!name && joinedUsers();
  }, [name]);

  const toggleToGroup = async () => {
    try {
      if (join) {
        await axios.post(`${backUrl}/groups/join`, { name, groupId });
      } else {
        await axios.delete(`${backUrl}/groups/unjoin/${usersGroupsId}`);
      }
      setJoin(!join);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleToFavorites = async () => {
    try {
      if (favorite) {
        await axios.patch(`${backUrl}/groups/${roleId}/favs/${usersGroupsId}`, {
          favs: false,
        });
        setFavoriteLength(favoriteLength - 1);
      } else {
        await axios.patch(`${backUrl}/groups/${roleId}/favs/${usersGroupsId}`, {
          favs: true,
        });
        setFavoriteLength(favoriteLength + 1);
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
      if (!!newLogo && !required && admin) {
        const socket = io(`${process.env.NEXT_PUBLIC_BACK_URL}/progressbar`);

        socket.connect();
        socket.emit('updateGroupLogo', {
          data: {
            oldName: name!,
            groupId,
            file: newLogo,
            name: logo || '',
            plan,
          },
        });

        new Promise((resolve, reject) => {
          socket.once('updateGroupLogo', (_data: number) => {
            resolve(_data);
            reject(_data);
            setProgressUpload(_data);
            _data === 100 && setValuesFields(data?.AnotherForm?.uploadFile);
            _data === 100 && socket.disconnect();
          });
        });
      } else {
        console.log('no logo selected');
      }
    } catch (e) {
      console.error(e);
      setValuesFields(data?.AnotherForm?.notUploadFile);
    }
  };
  if (useCurrentUser('/signin')) {
    return null;
  }

  return (
    <>
      <HeadCom path={asPath} content={`"${name}" group website`} />

      <article className={styles.mainContainer}>
        <div className={styles.logo}>
          <img src={logo} alt={`${name} logo`} />
          {admin && (
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
                name="newLogo"
                id="newLogo"
                padding=".35rem 1rem"
                margin=".5rem auto 1.5rem"
                onChange={changeFile}
                borderColor={!newLogo && required ? '#bd0000' : '#4F8DFF'}
              />

              <p style={{ color: '#bd0000' }}>{!newLogo && required && data?.NavForm?.validateRequired}</p>
              {!!newLogo && (
                <img
                  src={`${process.env.NEXT_PUBLIC_PAGE}/${newLogo.name}`}
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

      {!admin && (
        <div className={styles.buttons}>
          <Button
            leftIcon={join ? <CheckIcon boxSize={checkIcon} /> : <SmallAddIcon boxSize={smallIcon} />}
            style={join ? addingToGroupOutline : addingToGroup}
            colorScheme="blue"
            onClick={toggleToGroup}
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
                onClick={toggleToFavorites}
                variant={favorite ? 'solid' : 'outline'}
                className={`${styles.button} ${styles.favoriteButton}`}>
                {favorite ? data?.Groups?.favorite?.addedToFav : data?.Groups?.favorite?.addToFavorite}
              </Button>
              {!favorite && (
                <p>{favoriteLength < 5 ? data?.Groups?.favorite?.maxFav : data?.Groups?.favorite?.maximumAchieved}</p>
              )}
            </div>
          )}
        </div>
      )}

      {!admin && <Divider orientation="horizontal" />}

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
          {join && (
            <Tab
              _selected={{ borderColor: selectedColor }}
              _hover={{ borderColor: hoverColor }}
              _active={{ borderColor: activeColor }}
              borderColor={activeColor}
              className={styles.tab}>
              {decodeURIComponent(data?.Groups?.menu?.members)}
            </Tab>
          )}
          <Tab
            _selected={{ borderColor: selectedColor }}
            _hover={{ borderColor: hoverColor }}
            _active={{ borderColor: activeColor }}
            borderColor={activeColor}
            className={styles.tab}>
            {decodeURIComponent(data?.AnotherForm?.description)}
          </Tab>
        </TabList>

        <TabPanels padding={zeroPadding}>
          <TabPanel padding={zeroPadding}>
            <>
              {join && <AddingPost groupId={groupId!} />}
              {join ? (
                <Posts name={name!.toString()} groupId={groupId!} />
              ) : (
                <p className={styles.noPermission}>{data?.Groups?.noPermission}</p>
              )}
            </>
          </TabPanel>
          {join && (
            <TabPanel padding={zeroPadding}>
              <Members admin={admin} groupId={groupId} name={name!} />
            </TabPanel>
          )}
          <TabPanel padding={zeroPadding}>
            <DescriptionSection
              description={description}
              regulation={regulation}
              admin={admin}
              name={name}
              usersGroupsId={usersGroupsId!}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
