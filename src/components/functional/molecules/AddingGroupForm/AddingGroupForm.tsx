'use client';

import { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { createClient } from 'utils/supabase/clientCSR';
import {
  filesProfileTypes,
  handleFileSelection,
  isFileAccessApiSupported,
  MAX_PHOTO_SIZE,
  validateFile,
} from 'utils/client/files';
import { useI18n, useScopedI18n } from 'locales/client';

import { supabaseStorageUrlGroupUrl } from 'constants/links';
import { EventType, FilesUploadType, ResetFormType, UserType } from 'types/global.types';

import { FormError } from 'components/ui/atoms/FormError/FormError';
import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

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

  const t = useI18n();
  const tAnotherForm = useScopedI18n('AnotherForm');
  const fileTranslated: FilesUploadType = {
    fileSelectionCancelled: tAnotherForm('fileSelectionCancelled'),
    errorOpeningFilePicker: tAnotherForm('errorOpeningFilePicker'),
    validateRequired: t('NavForm.validateRequired'),
    fileTooLarge: tAnotherForm('fileTooLarge'),
    unsupportedFileType: tAnotherForm('unsupportedFileType'),
  };

  const handleChangeFile = async (e: EventType) => setLogoGroup(e.target.files?.[0] ? e.target.files[0] : null);

  const handleFile = async () => {
    const result = await handleFileSelection(fileTranslated, false);

    typeof result === 'string' ? setValuesFields(result) : setLogoGroup(result);
  };

  const createGroup = async ({ name, description }: AddingGroupType, { resetForm }: ResetFormType) => {
    try {
      if (!!logoGroup) {
        if (!(await validateFile(fileTranslated, logoGroup, userData.plan, false))) {
          const fileName = name + '-' + Date.now() + '-' + logoGroup.name;
          const filePath = name + '/' + fileName;

          if (logoGroup.size <= MAX_PHOTO_SIZE) {
            const { data, error } = await supabase.storage.from('logos').upload(`/${filePath}`, logoGroup);

            const logoGroupName = Date.now() + '/' + userData?.id! + '/' + logoGroup!.name!;

            if (!!error) {
              setValuesFields(tr.notUploadFile);
              console.error(error);
              !!data && (await supabase.storage.from('logos').remove([`/${filePath}`, logoGroupName]));
              return;
            }

            const { error: er } = await supabase.from('Groups').insert([
              {
                name,
                description,
                adminId: userData?.id!,
                logo: `${supabaseStorageUrlGroupUrl}/${data?.path!}`,
              },
            ]);

            !!er && setValuesFields(tr.uploadFile);

            await resetForm(initialValues);
            setLogoGroup(null);
          }
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

          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder={tr.name}
            className={touched.name && !!errors.name ? styles.field__error : styles.field}
          />

          <FormError nameError="groupName" />

          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder={tr.description}
            className={touched.description && !!errors.description ? styles.field__error : styles.field}
          />

          <FormError nameError="description" />

          {isFileAccessApiSupported ? (
            <button onClick={handleFile} className={styles.filePickerButton}>
              {tr.profilePhoto}
            </button>
          ) : (
            <input
              name="logo"
              type="file"
              accept={filesProfileTypes}
              onChange={handleChangeFile}
              placeholder={tr.profilePhoto}
              className={styles.input}
            />
          )}

          <button type="submit" className={`button ${styles.submit__button}`} aria-label={tr.ariaLabelButton}>
            {tr.send}
          </button>

          {!!valuesFields && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
