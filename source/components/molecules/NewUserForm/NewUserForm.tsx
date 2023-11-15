'use client';

import { useContext, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Input, Progress } from '@chakra-ui/react';
import { SchemaValidation } from 'source/shemasValidation/schemaValidation';

import { EventType } from 'source/types/global.types';

import { backUrl } from 'source/constants/links';

import { MenuContext } from "source/providers/MenuProvider";

import { Alerts } from 'source/components/atoms/Alerts/Alerts';
import { FormError } from 'source/components/molecules/FormError/FormError';

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
};

export const NewUserForm = ({ newUserTranslate, locale }: NewUserType) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const { changeMenu } = useContext(MenuContext);

  const { push } = useRouter();

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
        await axios.post(`${backUrl}/files`, {
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
        await axios.post(`${backUrl}/users`, { userData: { username, pseudonym, profilePhoto: photo?.name } });
        setValuesFields(newUserTranslate.successSending);
      }
      await axios.post(`${backUrl}/users`, { userData: { username, pseudonym } });
      setValuesFields(newUserTranslate.successSending);
      changeMenu('true');
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
