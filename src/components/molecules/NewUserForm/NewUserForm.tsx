'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Input } from '@chakra-ui/react';

import { convertStringToUnionType } from 'helpers/convertStringToType';

import { EventType, Provider } from 'types/global.types';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './NewUserForm.module.scss';
import { createClient } from 'utils/supabase/clientCSR';

type FirstDataType = {
  username: string;
  pseudonym: string;
  photo?: File | null;
};

type NewUserType = {
  id: string;
  email: string;
  provider: Provider;
  newUserTranslate: {
    title: string;
    username: string;
    pseudonym: string;
    profilePhoto: string;
    ariaLabelButton: string;
    send: string;
    successSending: string;
    errorSending: string;
    uploadFile: string;
  };
};

export const NewUserForm = ({ newUserTranslate, id, email, provider }: NewUserType) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);

  const { push } = useRouter();

  const supabase = createClient();

  const typeArray: Provider[] = ['email', 'google', 'discord', 'spotify'];
  const prov: Provider | undefined = convertStringToUnionType(provider, typeArray);

  const initialValues = {
    username: '',
    pseudonym: '',
  };

  const schemaValidation = Yup.object({
    username: SchemaValidation().username,
    pseudonym: SchemaValidation().pseudonym,
  });

  const handleChangeFile = async (e: EventType) => {
    console.log(e.target.files?.[0]);
    e.target.files?.[0] && setPhoto(e.target.files[0]);
  };

  const sendingData = async ({ username, pseudonym }: FirstDataType, { resetForm }: FormikHelpers<FirstDataType>) => {
    const insertToUsers = async (photo: boolean, name: string) => {
      const { error } = await supabase
        .from('Users')
        .insert([{ id, email, pseudonym, username, provider: prov!, profilePhoto: !!photo ? name : null }]);

      return error;
    };

    try {
      if (!!photo) {
        if (
          photo.size < 1200000 &&
          (photo.type === 'image/jpg' ||
            photo.type === 'image/jpeg' ||
            photo.type === 'image/png' ||
            photo.type === 'image/webp' ||
            photo.type === 'image/avif' ||
            photo.type === 'image/heif' ||
            photo.type === 'image/heic')
        ) {
          const name = Date.now() + '-' + id + '-' + photo!.name!;

          const { data, error } = await supabase.storage.from('profiles').upload(`${id}/${name}`, photo);

          if (!!error) setValuesFields(newUserTranslate.uploadFile);

          const userError = await insertToUsers(!!photo, name);
          !!userError && setValuesFields(newUserTranslate.errorSending);

          const publicUrl = supabase.storage.from('profiles').getPublicUrl(data?.path!).data.publicUrl;

          const { data: uploudPhoto, error: er } = await supabase.from('Files').insert([
            {
              name,
              shortDescription: photo.name,
              authorId: id,
              tags: 'profile',
              fileUrl: publicUrl,
              profileType: true,
            },
          ]);

          !!er && setValuesFields(newUserTranslate.errorSending);

          !!uploudPhoto && setValuesFields(newUserTranslate.uploadFile);

          if (!!er) {
            await supabase.storage.from('profiles').remove([`/${id}`, name]);

            return setValuesFields(newUserTranslate.errorSending);
          }
        } else {
          setValuesFields('wrong file type or size');
        }
      } else {
        const userError = await insertToUsers(!!photo, '');

        if (!!userError) {
          setValuesFields(newUserTranslate.errorSending);
        }
      }

      setValuesFields(newUserTranslate.successSending);
      resetForm();
      push('/signin');
    } catch (error) {
      console.error(error);
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
            accept=".jpg, .jpeg, .png, .webp, .avif, .heif, .heic"
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
