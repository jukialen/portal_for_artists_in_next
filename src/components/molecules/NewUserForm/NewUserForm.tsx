'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserResponse } from '@supabase/gotrue-js';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Input } from '@chakra-ui/react';

import { convertStringToUnionType } from 'helpers/convertStringToType';

import { EventType, Provider } from 'types/global.types';
import { Database } from 'types/database.types';

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

  const typeArray: Provider[] = ['email', 'google', 'discord', 'spotify'];
  const provider = userDataAuth.data.user?.app_metadata.provider!;
  const prov: Provider | undefined = convertStringToUnionType(provider, typeArray);

  const sendingData = async ({ username, pseudonym }: FirstDataType) => {
    try {
      if (!!photo) {
        if (
          photo.size < 6291456 &&
          (photo.type === 'image/jpg' ||
            photo.type === 'image/jpeg' ||
            photo.type === 'image/png' ||
            photo.type === ' image/webp' ||
            photo.type === 'image/avif' ||
            photo.type === 'video/mp4' ||
            photo.type === 'video/webm')
        ) {
          const { data, error } = await supabase.storage
            .from('profiles')
            .upload(`/${userDataAuth.data.user?.id!}`, photo);

          if (!!error) console.error(error);

          const name = Date.now() + '/' + userDataAuth.data.user?.id! + '/' + photo!.name!;
          const { error: er } = await supabase.from('Files').insert([
            {
              name,
              shortDescription: photo.name,
              authorId: userDataAuth.data.user?.id!,
              tags: 'profile',
              fileUrl: data?.path!,
              profileType: true,
            },
          ]);

          if (!!er) {
            setValuesFields(newUserTranslate.errorSending);
            console.error(er);
            !!data && (await supabase.storage.from('profiles').remove([`/${userDataAuth.data.user?.id!}`, name]));

            return;
          }
        }
      } else {
        setValuesFields('wrong file type or size');
      }
      const { error } = await supabase.from('Users').insert([
        {
          id: userDataAuth.data.user?.id!,
          email: userDataAuth.data.user?.email!,
          pseudonym,
          username,
          provider: prov!,
        },
      ]);

      if (!!error) {
        setValuesFields(newUserTranslate.errorSending);
        return;
      }
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

          {!!valuesFields && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
