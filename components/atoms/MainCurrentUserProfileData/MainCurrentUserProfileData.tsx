import { useState, useContext } from 'react';
import axios from 'axios';
import Image from 'next/image';
import {
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
  useDisclosure,
  Button,
} from '@chakra-ui/react';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { DataType, EventType } from 'types/global.types';

import { useUserData } from 'hooks/useUserData';

import { ModeContext } from 'providers/ModeProvider';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './MainCurrentUserProfileData.module.scss';
import { MdCameraEnhance } from 'react-icons/md';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';

export const MainCurrentUserProfileData = ({ data }: DataType) => {
  const [valuesFields, setValuesFields] = useState('');
  const { id, pseudonym, profilePhoto } = useUserData();
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const [required, setRequired] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);

  const { description } = useUserData();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isMode } = useContext(ModeContext);

  const selectedColor = '#FFD068';

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
      !!newLogo &&
        !required &&
        (await axios.patch(`${backUrl}/users/${pseudonym}`, {
          profilePhoto: newLogo,
        }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article className={styles.mainData}>
      <div className={styles.logoPseu}>
        <div className={styles.logo}>
          <Image src={`https://${cloudFrontUrl}/${profilePhoto}`} fill alt={`${profilePhoto} logo`} />
          <IconButton
            aria-label="update group logo"
            icon={<MdCameraEnhance />}
            colorScheme="yellow"
            className={styles.updateLogo}
            onClick={onOpen}
          />
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent backgroundColor={`${isMode ? '#2D3748' : ''}`} color={selectedColor}>
            <ModalHeader>Update logo</ModalHeader>
            <ModalCloseButton color={selectedColor} borderColor="transparent" />
            <ModalBody>
              <Input
                type="file"
                name="newLogo"
                id="newLogo"
                padding=".5rem 1rem"
                margin=".5rem auto 1.5rem"
                borderRadius="1rem"
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
        <h1 className={styles.name}>{pseudonym || 'anarchymen'}</h1>
      </div>
      <div className={styles.description}>
        {description ||
          "I'm a visual artist who creates paintings, drawings, and sculptures. I'm inspired by the natural world and the human experience. I'm passionate about using my art to communicate my ideas and emotions. I'm always looking for new ways to express myself creatively."}
      </div>
      <FilesUpload />
    </article>
  );
};
