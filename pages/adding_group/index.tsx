import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { Form, Formik } from 'formik';
import { Button, Input, Progress, Textarea } from '@chakra-ui/react';
import * as Yup from 'yup';

import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { EventType, ResetFormType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { backUrl } from 'utilites/constants';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './adding_group.module.scss';

type AddingGroupType = {
  name: string;
  description: string;
};

export default function AddingGroup() {
  const { asPath, push } = useRouter();

  const data = useHookSWR();

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
        setValuesFields(data?.AnotherForm?.uploadFile);
      } else {
        const socket = io(`${process.env.NEXT_PUBLIC_BACK_URL}/progressbar`);

        const group: { groupId: string } = await axios.post(`${backUrl}/groups`, {
          name,
          description,
          logo: logoGroup!.name,
        });

        socket.connect();
        socket.emit('createGroup', {
          groupId: group.groupId,
          file: logoGroup,
          data: {
            name,
            tags: 'group',
            shortDescription: description,
          },
        });

        await new Promise((resolve, reject) => {
          socket.once('createGroup', (_data: number) => {
            resolve(_data);
            reject(_data);
            setProgressUpload(_data);

            if (_data === 100) {
              setValuesFields(data?.AnotherForm?.uploadFile);
              resetForm(initialValues);
              socket.disconnect();
              push(`/${name}`);
            }
          });
        });
      }
    } catch (e) {
      console.log(e);
      setValuesFields(data?.NewUser?.errorSending);
    }
  };

  if (useCurrentUser('/signin')) {
    return null;
  }
  return (
    <>
      <HeadCom path={asPath} content="User's adding some group " />

      <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={createGroup}>
        {({ values, handleChange, errors, touched }) => (
          <Form className={styles.container__form}>
            <h2 className={styles.title}>{data?.AddingGroup.title}</h2>

            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder={data?.AddingGroup?.name}
              className={touched.name && !!errors.name ? styles.field__error : styles.field}
            />

            <FormError nameError="groupName" />

            <Textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder={data?.AnotherForm?.description}
              className={touched.description && !!errors.description ? styles.field__error : styles.field}
            />

            <FormError nameError="description" />

            <Input
              name="logo"
              type="file"
              accept=".jpg, .jpeg, .png, .webp, .avif"
              onChange={handleChangeFile}
              placeholder={data?.AnotherForm?.profilePhoto}
              focusBorderColor="transparent"
              className={styles.input}
            />

            <Button
              colorScheme="transparent"
              color="black.800"
              type="submit"
              className={`button ${styles.submit__button}`}
              aria-label={data?.NewUser?.ariaLabelButtom}>
              {data?.AnotherForm?.send}
            </Button>

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
