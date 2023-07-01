import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Input, Progress } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { EventType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './index.module.scss';

type FirstDataType = {
  username: string;
  pseudonym: string;
};

export default function NewUser() {
  const [valuesFields, setValuesFields] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState<number>(0);

  const { push, asPath } = useRouter();
  const loading = useCurrentUser('/');
  const data = useHookSWR();

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
        return axios.post(`${backUrl}/files`, {
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
      }
      await axios.post(`${backUrl}/users`, { userData: { username, pseudonym } });
      setValuesFields(data?.NewUser?.successSending);
      return push('/app');
    } catch (error) {
      setValuesFields(data?.NewUser?.errorSending);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <HeadCom path={asPath} content="The first addition of data by a new user." />

      <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={sendingData}>
        {({ values, handleChange, errors, touched }) => (
          <Form className={styles.first__data}>
            <h2 className={styles.title}>{data?.NewUser?.title}</h2>

            <Input
              name="username"
              type="text"
              value={values.username}
              onChange={handleChange}
              placeholder={data?.NewUser?.name}
              className={touched.username && !!errors.username ? styles.inputForm__error : styles.inputForm}
            />

            <FormError nameError="username" />

            <Input
              name="pseudonym"
              type="text"
              value={values.pseudonym}
              onChange={handleChange}
              placeholder={data?.AnotherForm?.pseudonym}
              className={touched.pseudonym && !!errors.pseudonym ? styles.inputForm__error : styles.inputForm}
            />

            <FormError nameError="pseudonym" />

            <Input
              name="profilePhoto"
              type="file"
              accept=".jpg, .jpeg, .png, .webp, .avif"
              onChange={handleChangeFile}
              placeholder={data?.AnotherForm?.profilePhoto}
              className={styles.inputForm}
            />

            <FormError nameError="profilePhoto" />

            <button
              type="submit"
              className={`button ${styles.submit__button}`}
              aria-label={data?.NewUser?.ariaLabelButtom}>
              {data?.AnotherForm?.send}
            </button>

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
          </Form>
        )}
      </Formik>
    </>
  );
}
