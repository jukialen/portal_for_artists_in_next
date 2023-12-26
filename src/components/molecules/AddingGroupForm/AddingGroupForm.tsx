'use client';

import { useState } from 'react';
import { useUserData } from 'hooks/useUserData';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { EventType, ResetFormType } from 'types/global.types';
import axios from 'axios';
import { backUrl } from 'constants/links';
import Session from 'supertokens-web-js/recipe/session';
import { io, Socket } from 'socket.io-client';
import { Form, Formik } from 'formik';
import styles from '*.module.scss';
import { Button, Input, Progress, Textarea } from '@chakra-ui/react';
import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

type AddingGroupType = {
  name: string;
  description: string;
};

type AddingGroupTr = {
  tr: {
    title: string;
    name: string;
    description: string;
    profilePhoto: string;
    send: string;
    uploadFile: string;
    ariaLabelButton: string;
    error: string;
  };
};

export const AddingGroupForm = ({ tr }: AddingGroupTr) => {
  const userData = useUserData();

  const [valuesFields, setValuesFields] = useState<string>('');
  const [logoGroup, setLogoGroup] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState<number>(0);

  const initialValues = {
    name: '',
    description: '',
  };

  const schemaValidation = Yup.object({
    name: SchemaValidation().groupName,
    description: SchemaValidation().description,
  });

  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] ? setLogoGroup(e.target.files[0]) : setLogoGroup(null);
  };

  const createGroup = async ({ name, description }: AddingGroupType, { resetForm }: ResetFormType) => {
    try {
      if (!logoGroup) {
        await axios.post(`${backUrl}/groups`, {
          data: {
            name,
            description,
          },
        });
        await resetForm(initialValues);
        setValuesFields(tr.uploadFile);
      } else {
        const token = await Session.getAccessToken();
        if (token === undefined) {
          throw new Error('User is not logged in');
        }
        const socket = io(`${process.env.NEXT_PUBLIC_BACK_URL}/progressbar`, {
          query: { token },
        });

        console.log('name', name);

        socket.connect();
        socket.emit('createGroup', {
          file: logoGroup,
          data: {
            name,
            description,
            tags: 'group',
            shortDescription: description,
            plan: userData?.plan,
          },
        });

        const api = async function (socket: Socket) {
          await new Promise((resolve, reject) => {
            console.log(reject);

            socket.once('createGroup', (_data: number) => {
              const dat = resolve(_data);

              console.log(dat);
              //              setProgressUpload(_data);

              //              if (_data === 100) {
              //                setValuesFields(tr.uploadFile);
              //                resetForm(initialValues);
              //                socket.close();
              //                push(`/${name}`);
              //              }
            });
          });
        };
        await api(socket);
      }
    } catch (e) {
      console.error(e);
      setValuesFields(tr.error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={createGroup}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.container__form}>
          <h2 className={styles.title}>{tr.title}</h2>

          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder={tr.name}
            className={touched.name && !!errors.name ? styles.field__error : styles.field}
          />

          <FormError nameError="groupName" />

          <Textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder={tr.description}
            className={touched.description && !!errors.description ? styles.field__error : styles.field}
          />

          <FormError nameError="description" />

          <Input
            name="logo"
            type="file"
            accept=".jpg, .jpeg, .png, .webp, .avif"
            onChange={handleChangeFile}
            placeholder={tr.profilePhoto}
            focusBorderColor="transparent"
            className={styles.input}
          />

          <Button
            colorScheme="transparent"
            color="black.800"
            type="submit"
            className={`button ${styles.submit__button}`}
            aria-label={tr.ariaLabelButton}>
            {tr.send}
          </Button>

          {progressUpload >= 1 && !(valuesFields === `${tr.uploadFile}`) && (
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
