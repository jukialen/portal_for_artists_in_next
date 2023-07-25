import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
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
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { DataType, EventType, ResetFormType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { useUserData } from 'hooks/useUserData';

import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './ProfileAccount.module.scss';
import defaultAvatar from 'public/defaultAvatar.png';
import { useRouter } from 'next/router';
import { MdCameraEnhance } from 'react-icons/md';
import { Button } from 'antd';

export const ProfileAccount = ({ data }: DataType) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const { id, pseudonym, description, profilePhoto } = useUserData();
  const [form, setForm] = useState(false);
  const [photoURL, setPhotoURL] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const [required, setRequired] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);

  const { asPath } = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    profilePhoto && setPhotoURL(profilePhoto);
  }, [profilePhoto]);

  const initialValues = {
    newPseudonym: pseudonym!,
    newDescription: description!,
    photo: null,
  };

  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#82FF82';
  const borderColor = '#4F8DFF';

  return (
    <article id="profile" className={styles.profile}>
      <h2 className={styles.title}>{data?.Account?.profile?.aboutMe}</h2>
      <div className={styles.publicContainer}>
        <div className={styles.description}>
          {description ||
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque condimentum facilisis dui, ut elementum urna efficitur ut. Integer euismod molestie felis. Suspendisse potenti. Quisque eu ornare urna, sit amet condimentum massa. Fusce auctor lacinia leo, ut tincidunt dui ullamcorper eu. Aenean accumsan nibh a dapibus accumsan. Morbi pellentesque id tortor non lacinia. Maecenas a magna lectus. Praesent aliquet orci sit amet tellus consequat, at tristique dui volutpat. Etiam facilisis sapien at facilisis gravida. Curabitur porta, lacus nec malesuada faucibus, ex tortor rutrum dui, in aliquet orci orci a nisi.'}
        </div>
      </div>
    </article>
  );
};
