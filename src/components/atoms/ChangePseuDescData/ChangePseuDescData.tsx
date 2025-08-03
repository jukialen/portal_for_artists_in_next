'use client';

import { useContext, useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Input, Textarea } from '@chakra-ui/react';

import { useI18n, useScopedI18n } from 'locales/client';

import { darkMode } from 'constants/links';
import { EventType, ResetFormType, UserType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './ChangePseuDescData.module.scss';

type ProfileType = {
  newPseudonym: string;
  newDescription: string;
};

export const ChangePseuDescData = ({ userData }: { userData: UserType }) => {
  const { isMode } = useContext(ModeContext);
  const [valuesFields, setValuesFields] = useState('');
  const [photo, setPhoto] = useState<File | undefined>();
  const supabase = createClient();

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
      if (
        userData?.profilePhoto === null &&
        !!photo &&
        photo.size < 6291456 &&
        (photo.type === 'image/jpg' ||
          photo.type === 'image/jpeg' ||
          photo.type === 'image/png' ||
          photo.type === ' image/webp' ||
          photo.type === 'image/avif')
      ) {
        const { data: pDatahoto, error } = await supabase.storage.from('profiles').upload(`/${userData?.id!}`, photo);

        if (!!error || !pDatahoto) {
          setValuesFields(t('AnotherForm.notUploadFile'));
          return;
        }

        const { error: er } = await supabase
          .from('Users')
          .update({ pseudonym: newPseudonym, description: newDescription, profilePhoto: pDatahoto?.path! });
        setValuesFields(tAnotherForm('uploadFile'));
        if (!!er) {
          setValuesFields(tAccount('profile.errorSending'));
          return;
        }
      } else {
        const { error: e } = await supabase
          .from('Users')
          .update({ pseudonym: newPseudonym, description: newDescription });

        if (!!e) {
          setValuesFields(tAccount('profile.errorSending'));
          return;
        }
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
              className={!!errors.newPseudonym && touched.newPseudonym ? styles.input__error : styles.input}
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
              className={
                !!errors.newDescription && touched.newDescription ? styles.description__error : styles.description
              }
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

          {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
