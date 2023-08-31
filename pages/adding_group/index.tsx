import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { Button, Input, Progress, Textarea } from '@chakra-ui/react';
import * as Yup from 'yup';

import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { EventType, ResetFormType, Tags } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './adding_group.module.scss';
import axios from 'axios';
import { backUrl } from '../../utilites/constants';

type AddingGroupType = {
  name: string;
  description: string;
};

export default function AddingGroup() {
  const { asPath } = useRouter();

  const loading = useCurrentUser('/');
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
      const newGroup = async () => {
        await axios.post(`${backUrl}/groups`, {
          name,
          description,
        });
        await resetForm(initialValues);
      };

      const newGroupWithLogo = async () => {
        await axios.post(`${backUrl}/files`, {
          file: logoGroup,
          name: logoGroup!.name,
          tags: Tags.group,
        });

        await axios.post(`${backUrl}/groups`, {
          name,
          description,
          logo: logoGroup!.name,
        });
      };

      logoGroup === null ? await newGroup() : newGroupWithLogo();
    } catch (e) {
      console.log(e);
      setValuesFields(data?.NewUser?.errorSending);
    }
  };

  if (loading) {
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
