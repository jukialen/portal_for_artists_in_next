'use client';

import { useEffect, useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { useI18n, useScopedI18n } from 'locales/client';

import { filesProfileTypes, isFileAccessApiSupported, validateFile, handleFileSelection } from 'utils/client/files';

import { EventType, FilesUploadType, ResetFormType, UserType } from 'types/global.types';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';
import { FormError } from 'components/ui/atoms/FormError/FormError';

import styles from './ChangePseuDescData.module.scss';

type ProfileType = {
  newPseudonym: string;
  newDescription: string;
};

export const ChangePseuDescData = ({
  userData,
  fileTranslated,
}: {
  userData: UserType;
  fileTranslated: FilesUploadType;
}) => {
  const [valuesFields, setValuesFields] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supabase = createClient();

  const t = useI18n();
  const tAnotherForm = useScopedI18n('AnotherForm');
  const tAccount = useScopedI18n('Account');

  const initialValues = {
    newPseudonym: userData?.pseudonym!,
    newDescription: userData?.description!,
    photo: userData?.profilePhoto || null,
  };

  const schemaNew = Yup.object({
    newPseudonym: SchemaValidation().pseudonym,
    newDescription: SchemaValidation().description,
  });

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }

    console.log('photo', photo);
    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] && setPhoto(e.target.files[0]);
  };

  const handleFile = async () => {
    const result = await handleFileSelection(fileTranslated);

    typeof result === 'string' ? setValuesFields(result) : setPhoto(result);
  };
  const updateProfileData = async ({ newPseudonym, newDescription }: ProfileType, { resetForm }: ResetFormType) => {
    setValuesFields('');

    try {
      let profilePhotoPath = userData?.profilePhoto || null;
      let updatePhotoInDB = false;

      if (!!photo) {
        const photoError = await validateFile(fileTranslated, photo, userData?.plan!);
        if (photoError) {
          setValuesFields(photoError);
          return;
        }

        const { data, error } = await supabase.storage
          .from('profiles')
          .upload(`/${userData?.id!}/${photo.name}`, photo, {
            upsert: !!userData?.profilePhoto,
          });

        if (error || !data) {
          setValuesFields(tAnotherForm('notUploadFile'));
          console.error('Photo upload error:', error);
          return;
        }
        profilePhotoPath = data?.path;
        updatePhotoInDB = true;
      }

      const updateData: Partial<UserType> = {
        pseudonym: newPseudonym,
        description: newDescription,
      };

      if (updatePhotoInDB && profilePhotoPath) updateData.profilePhoto = profilePhotoPath;

      const { error: usersError } = await supabase.from('Users').update(updateData);

      if (usersError) {
        setValuesFields(tAccount('profile.errorSending'));
        console.error('Database update error:', usersError);
        return;
      }

      resetForm(initialValues);
      setPhoto(null);
      setValuesFields(tAccount('profile.successSending'));
    } catch (e) {
      console.error('General profile update error:', e);
      setValuesFields(tAccount('profile.errorSending'));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schemaNew}
      onSubmit={(values, formikBag) => updateProfileData(values, { resetForm: formikBag.resetForm })}>
      {({ errors, touched }) => (
        <Form className={styles.form}>
          <div className={styles.container}>
            {isFileAccessApiSupported ? (
              <button type="button" onClick={() => handleFile()} className={`${styles.filePickerButton} button`}>
                {tAnotherForm('profilePhoto')}
              </button>
            ) : (
              <>
                <label htmlFor={tAnotherForm('profilePhoto')} className={styles.title}>
                  {tAnotherForm('profilePhoto')}
                </label>
                <input
                  id="photoInput"
                  name="photo"
                  type="file"
                  accept={filesProfileTypes}
                  onChange={handleChangeFile}
                  placeholder={tAnotherForm('profilePhoto')}
                  className={!photo && touched.photo ? styles.input__error : styles.input}
                />
              </>
            )}
          </div>

          {!photo && touched.photo && <p className={styles.error_profile}>{t('NavForm.validateRequired')}</p>}

          <div className={styles.container}>
            <label className={styles.title} htmlFor="newPseudonym">
              {tAnotherForm('pseudonym')}
            </label>
            <input
              id="newPseudonym"
              name="newPseudonym"
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
            <textarea
              id="newDescription"
              name="newDescription"
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

          <button
            className="button"
            type="submit"
            aria-label={tAccount('profile.ariaLabelButton')}
            onChange={() => setPhoto(null)}>
            {tAccount('profile.save')}
          </button>

          {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
