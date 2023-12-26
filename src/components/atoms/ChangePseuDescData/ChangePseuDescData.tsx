'use client'

import { useContext, useState } from 'react';
import { Input, Progress, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import { backUrl, darkMode } from 'constants/links';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { useUserData } from 'hooks/useUserData';

import { useI18n, useScopedI18n } from 'locales/client';
import { EventType, ResetFormType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './ChangePseuDescData.module.scss';

type ProfileType = {
  newPseudonym: string;
  newDescription: string;
};

export const ChangePseuDescData = () => {
  const userData = useUserData();

  const { isMode } = useContext(ModeContext);
  const [valuesFields, setValuesFields] = useState('');
  const [photo, setPhoto] = useState<File | string | null>(userData?.profilePhoto || null);

  const [progressUpload, setProgressUpload] = useState(0);

  const t = useI18n();
  const tAnotherForm = useScopedI18n('AnotherForm');
  const tAccount = useScopedI18n('Account');

  const initialValues = {
    newPseudonym: userData?.pseudonym!,
    newDescription: userData?.description!,
    photo: null,
  };

  const schemaNew = Yup.object({
    newPseudonym: SchemaValidation().pseudonym,
    newDescription: SchemaValidation().description,
  });

  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] && setPhoto(e.target.files[0]);
  };

  const updateProfileData = async ({ newPseudonym, newDescription }: ProfileType, { resetForm }: ResetFormType) => {
    try {
      const newUserData = axios.patch(`${backUrl}/users/${userData?.pseudonym}`, {
        pseudonym: newPseudonym,
        description: newDescription,
      });

      if (userData?.profilePhoto !== null) {
        await axios.patch(`${backUrl}/files/${userData?.id}`, {
          data: { file: photo },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        await newUserData;

        setValuesFields(tAnotherForm('uploadFile'));

        //     setValuesFields(t('AnotherForm.notUploadFile'));
      } else {
        return newUserData;
      }

      resetForm(initialValues);
      setValuesFields(tAccount('profile.successSending'));
    } catch (e) {
      console.log(e);
      setValuesFields(tAccount('profile.errorSending'));
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={updateProfileData}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.form}>
          <div className={styles.container}>
            <label htmlFor={tAnotherForm('profilePhoto')} className={styles.title}>
              {tAnotherForm('profilePhoto')}
            </label>
            <Input
              name="photo"
              type="file"
              accept=".jpg, .jpeg, .png, .webp, .avif"
              onChange={handleChangeFile}
              placeholder={tAnotherForm('profilePhoto')}
              className={(photo === null || undefined) && touched.photo ? styles.input__error : styles.input}
            />
          </div>

          {(photo === null || undefined) && touched.photo && (
            <p className={styles.error_profile}>{t('NavForm.validateRequired')}</p>
          )}

          <div className={styles.container}>
            <label className={styles.title} htmlFor="newPseudonym">
              {tAnotherForm('pseudonym')}
            </label>
            <Input
              id="newPseudonym"
              name="newPseudonym"
              value={values.newPseudonym}
              onChange={handleChange}
              placeholder={tAnotherForm('pseudonym')}
              className={`
            ${!!errors.newPseudonym && touched.newPseudonym ? styles.input__error : styles.input}
            ${isMode === darkMode ? styles.input__dark : ''}
          `}
            />
          </div>

          {!!errors.newPseudonym && touched.newPseudonym && (
            <div className={styles.error_wrap}>
              <FormError nameError="newPseudonym" />
            </div>
          )}

          <div className={styles.container}>
            <label className={styles.title} htmlFor="newDescription">
              {tAccount('profile.aboutMe')}
            </label>
            <Textarea
              id="newDescription"
              name="newDescription"
              value={values.newDescription}
              onChange={handleChange}
              placeholder={tAccount('profile.aboutMe')}
              className={`
            ${!!errors.newDescription && touched.newDescription ? styles.description__error : styles.description}
            ${isMode === darkMode ? styles.description__dark : ''}
          `}
            />
          </div>
          {!!errors.newDescription && touched.newDescription && (
            <div className={styles.error_wrap}>
              <FormError nameError="newDescription" />
            </div>
          )}

          <button className={`${styles.button} button`} type="submit" aria-label={tAccount('profile.ariaLabelButton')}>
            {tAccount('profile.save')}
          </button>

          {progressUpload >= 1 && !(valuesFields === `${tAnotherForm('uploadFile')}`) && (
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
