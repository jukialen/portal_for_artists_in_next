'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { io } from "socket.io-client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserResponse } from '@supabase/gotrue-js';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Input, Progress } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { EventType } from 'types/global.types';
import { Database } from "types/database.types";

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './NewUserForm.module.scss';

type FirstDataType = {
  username: string;
  pseudonym: string;
};

type NewUserType = {
  newUserTranslate: {
    title: string;
    username: string;
    pseudonym: string;
    profilePhoto: string;
    ariaLabelButton: string;
    send: string;
    uploadFile: string;
    successSending: string;
    errorSending: string;
  };
  locale: string;
  userDataAuth: UserResponse;
};

export const NewUserForm = ({ newUserTranslate, locale, userDataAuth }: NewUserType) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState<number>(0);

  const { push } = useRouter();
  const supabase = createClientComponentClient<Database>();

  const initialValues = {
    username: '',
    pseudonym: '',
  };

  const schemaValidation = Yup.object({
    username: SchemaValidation().username,
    pseudonym: SchemaValidation().pseudonym,
  });

  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] && setPhoto(e.target.files[0]);
  };

  const sendingData = async ({ username, pseudonym }: FirstDataType) => {
    try {
      if (!!photo) {
        await axios.post(`${process.env.NEXT_PUBLIC_PAGE}/api/upload_file`, {
          file: photo,
          data: {
            name: photo?.name,
            profileType: true,
            tags: 'profile',
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const socket = io(`${process.env.NEXT_PUBLIC_PAGE}/api/upload_file`);
        
        socket.connect();
        socket.on('new-file', (status : number) => {
          console.log(status);
        });
        
        //        function (socket: Socket) {
        new Promise((resolve, reject) => {
          socket.on('new-file', (_data: number) => {
            resolve(_data);
            reject(_data);
            setProgressUpload(_data);
            console.log(resolve(_data));
            console.log(reject(_data));
            _data === 100 && setValuesFields(newUserTranslate.uploadFile);
            (_data === 100 && socket.connected) && socket.close();
          });
        });
        
        const { error } = await supabase
          .from('Users')
          .insert({
            id: userDataAuth.data.user?.id,
            email: userDataAuth.data.user?.email,
            pseudonym,
            username,
            provider: userDataAuth.data.user?.app_metadata.provider,
          });
        setValuesFields(newUserTranslate.successSending);
      }
      const { error } = await supabase
        .from('Users')
        .insert({
          id: userDataAuth.data.user?.id,
          email: userDataAuth.data.user?.email,
          pseudonym,
          username,
          provider: userDataAuth.data.user?.app_metadata.provider,
        });
      setValuesFields(newUserTranslate.successSending);
      localStorage.setItem('menu', 'true');
      return push(`/${locale}/app`);
    } catch (e) {
      console.log(e);
      setValuesFields(newUserTranslate.errorSending);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={sendingData}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.first__data}>
          <h2 className={styles.title}>{newUserTranslate.title}</h2>

          <Input
            name="username"
            type="text"
            value={values.username}
            onChange={handleChange}
            placeholder={newUserTranslate.username}
            className={touched.username && !!errors.username ? styles.inputForm__error : styles.inputForm}
          />

          <FormError nameError="username" />

          <Input
            name="pseudonym"
            type="text"
            value={values.pseudonym}
            onChange={handleChange}
            placeholder={newUserTranslate.pseudonym}
            className={touched.pseudonym && !!errors.pseudonym ? styles.inputForm__error : styles.inputForm}
          />

          <FormError nameError="pseudonym" />

          <Input
            name="profilePhoto"
            type="file"
            accept=".jpg, .jpeg, .png, .webp, .avif"
            onChange={handleChangeFile}
            placeholder={newUserTranslate.profilePhoto}
            className={styles.inputForm}
          />

          <FormError nameError="profilePhoto" />

          <button
            type="submit"
            className={`button ${styles.submit__button}`}
            aria-label={newUserTranslate.ariaLabelButton}>
            {newUserTranslate.send}
          </button>

          {progressUpload >= 1 && !(valuesFields === `${newUserTranslate.uploadFile}`) && (
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
        </Form>
      )}
    </Formik>
  );
};
