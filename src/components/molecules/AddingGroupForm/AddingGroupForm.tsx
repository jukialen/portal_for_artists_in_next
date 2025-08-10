'use client';

import { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Button, Input, Textarea } from '@chakra-ui/react';

import { createClient } from 'utils/supabase/clientCSR';

import { EventType, ResetFormType, UserType } from 'types/global.types';

import { FormError } from 'components/atoms/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './AddingGroup.module.scss';

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
    notUploadFile: string;
    ariaLabelButton: string;
    error: string;
  };
  userData: UserType;
};

export const AddingGroupForm = ({ tr, userData }: AddingGroupTr) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const [logoGroup, setLogoGroup] = useState<File | null>(null);

  const initialValues = {
    name: '',
    description: '',
  };

  const schemaValidation = Yup.object({
    name: SchemaValidation().groupName,
    description: SchemaValidation().description,
  });

  const supabase = createClient();

  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] ? setLogoGroup(e.target.files[0]) : setLogoGroup(null);
  };

  const createGroup = async ({ name, description }: AddingGroupType, { resetForm }: ResetFormType) => {
    try {
      if (!!logoGroup) {
        if (
          logoGroup.size < 6291456 &&
          (logoGroup.type === 'image/jpg' ||
            logoGroup.type === 'image/jpeg' ||
            logoGroup.type === 'image/png' ||
            logoGroup.type === ' image/webp' ||
            logoGroup.type === 'image/avif' ||
            logoGroup.type === 'video/mp4' ||
            logoGroup.type === 'video/webm')
        ) {
          const { data, error } = await supabase.storage.from('profiles').upload(`/${userData?.id!}`, logoGroup);

          const name = Date.now() + '/' + userData?.id! + '/' + logoGroup!.name!;

          if (!!error) {
            setValuesFields(tr.notUploadFile);
            console.error(error);
            !!data && (await supabase.storage.from('profiles').remove([`/${userData?.id!}`, name]));
            return;
          }

          const { error: er } = await supabase.from('Groups').insert([
            {
              name,
              description,
              adminId: userData?.id!,
              logo: data?.path!,
            },
          ]);

          !!er && setValuesFields(tr.uploadFile);
        }
      } else {
        const { data, error } = await supabase
          .from('Groups')
          .insert([
            {
              name,
              description,
              adminId: userData?.id!,
            },
          ])
          .select('groupId')
          .limit(1)
          .single();

        if (!!error || !data) {
          setValuesFields(tr.error);
          return;
        }

        const { error: rError } = await supabase
          .from('Roles')
          .insert([{ groupId: data.groupId, userId: userData?.id!, role: 'ADMIN' }]);

        if (!!rError) {
          setValuesFields(tr.error);
          return;
        }
        await resetForm(initialValues);
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

          {!!valuesFields && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
