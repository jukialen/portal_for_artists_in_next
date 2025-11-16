'use client';

import { useEffect, useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Upload } from 'tus-js-client';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from '../../../../shemasValidation/schemaValidation';
import { Dialog } from '@ark-ui/react/dialog';

import { useI18n, useScopedI18n } from 'locales/client';

import {
  filesProfileTypes,
  filesTypes,
  handleFileSelection,
  isFileAccessApiSupported,
  validatePhoto,
} from 'utils/client/files';

import { access_token, projectUrl } from 'constants/links';
import { Tags, EventType, ResetFormType, FilesUploadType } from 'types/global.types';

import { FormError } from 'components/ui/atoms/FormError/FormError';
import { Alerts } from 'components/ui/atoms/Alerts/Alerts';
import { ProgressBar } from 'components/ui/atoms/ProgressBar/ProgressBar';

import styles from './FileUpload.module.scss';
import { MdUploadFile } from 'react-icons/md';

type FileDataType = {
  shortDescription: string;
  tags: Tags | '';
};

const initialValues: FileDataType = {
  shortDescription: '',
  tags: '',
};

export const FilesUpload = ({ userId, fileTranslated }: { userId: string; fileTranslated: FilesUploadType }) => {
  const [file, setFile] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const [required, setRequired] = useState(false);
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supabase = createClient();
  const tAnotherForm = useScopedI18n('AnotherForm');
  const tAside = useScopedI18n('Aside');
  const t = useI18n();

  const schemaFile = Yup.object({
    tags: SchemaValidation().tags,
    shortDescription: SchemaValidation().shortDescription,
  });

  const closePreviewPhoto = () => {
    setPreviewUrl(null);
    setFile(null);
  };

  useEffect(() => {
    if (!file) {
      closePreviewPhoto();
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleChangeFile = async (e: EventType) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setRequired(false);
    } else {
      closePreviewPhoto();
      setRequired(true);
    }
  };

  const handleFile = async () => {
    const result = await handleFileSelection(fileTranslated, false);

    typeof result === 'string' ? setValuesFields(result) : setFile(result);
  };

  const uploadFiles = async ({ tags, shortDescription }: FileDataType, { resetForm }: ResetFormType) => {
    try {
      if (!file || !tags) {
        setRequired(true);
        return;
      }

      if (!(await validatePhoto(fileTranslated, file, false))) {
        const { data, error } = await supabase.storage.from('basic').upload(`/${userId}`, file);

        if (!!error) console.error(error);

        const { error: er } = await supabase.from('Files').insert([
          {
            name: Date.now() + '/' + userId + '/' + file!.name!,
            shortDescription,
            authorId: userId,
            tags,
            fileUrl: data?.path!,
          },
        ]);

        if (!!er) console.error(er);
      } else {
        return new Promise<void>(async (resolve, reject) => {
          let upload = new Upload(file, {
            endpoint: ` ${projectUrl}/storage/v1/upload/resumable`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: { authorization: `Bearer ${access_token}` },
            uploadDataDuringCreation: true,
            removeFingerprintOnSuccess: true,
            metadata: {
              bucketName: 'basic',
              objectName: file.name,
              contentType: 'image/jpg, image/jpeg, image/png, image/webp, image/avif, video/mp4, video/webm',
              cacheControl: '3600',
            },
            chunkSize: 6 * 1024 * 1024,
            onError: function (error) {
              console.error('Failed because: ' + error);
              setValuesFields(tAnotherForm('notUploadFile'));
              reject(error);
            },
            onProgress: function (bytesUploaded, bytesTotal) {
              let percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
              console.log(bytesUploaded, bytesTotal, percentage + '%');
              setProgressUpload(parseInt(percentage));
            },
            onSuccess: async function () {
              console.log('Download %s from %s', file.name, upload.url);
              setProgressUpload(100);
              setValuesFields(tAnotherForm('uploadFile'));

              if (progressUpload === 100) {
                const { error } = await supabase.from('Files').insert([
                  {
                    name: Date.now() + '/' + userId + '/' + file!.name!,
                    shortDescription,
                    authorId: userId,
                    tags,
                    fileUrl: upload.url!,
                  },
                ]);
                if (!!error) console.error(error);
              }
              resolve();
            },
          });

          // Check if there are any previous uploads to continue.
          const previousUploads = await upload.findPreviousUploads();
          // Found previous uploads so we select the first one.
          if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }
          // Start the upload
          upload.start();
        });
      }

      setValuesFields(tAnotherForm('uploadFile'));
      closePreviewPhoto();
      setRequired(false);
      resetForm(initialValues);
    } catch (e) {
      console.error(e);
      setValuesFields(tAnotherForm('notUploadFile'));
    }
  };

  type SelectOptionsType = { value: string; name: string };

  const selectOptions: SelectOptionsType[] = [
    { value: '', name: t('chooseTag') },
    { value: 'realistic', name: tAside('realistic') },
    { value: 'manga', name: tAside('manga') },
    { value: 'anime', name: tAside('anime') },
    { value: 'comics', name: tAside('comics') },
    { value: 'photographs', name: tAside('photographs') },
    { value: 'videos', name: tAside('videos') },
    { value: 'animations', name: tAside('animations') },
  ];

  return (
    <Dialog.Root
      lazyMount
      restoreFocus
      open={open}
      onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <button aria-label="new logo" className={styles.updateLogo} onClick={() => setOpen(true)}>
          <MdUploadFile />
          {t('newFile')}
        </button>
      </Dialog.Trigger>

      <Dialog.Content className={styles.modelContent}>
        <div className={styles.modelContentHeader}>
          <Dialog.Title>{tAnotherForm('fileTitle')}</Dialog.Title>
        </div>
        <Dialog.Description>
          <Formik
            initialValues={initialValues}
            validationSchema={schemaFile}
            onSubmit={(values: FileDataType, formikBag: ResetFormType) =>
              uploadFiles(values, { resetForm: formikBag.resetForm })
            }>
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form className={styles.adding__files}>
                <div className={styles.select}>
                  <select
                    name="tags"
                    value={values.tags}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.tags && touched.tags ? styles.tags__error : styles.tags}>
                    {selectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <FormError nameError="tags" />

                {isFileAccessApiSupported ? (
                  <button onClick={handleFile} className={styles.filePickerButton}>
                    {tAnotherForm('file')}
                  </button>
                ) : (
                  <input
                    name="file"
                    type="file"
                    accept={`${filesProfileTypes}, ${filesTypes}`}
                    onChange={handleChangeFile}
                    placeholder={tAnotherForm('file')}
                    className={!file && required ? styles.input__error : styles.input}
                  />
                )}

                {!!previewUrl && <img src={previewUrl} alt="preview new logo" className={styles.filePickerImage} />}

                <p className={styles.error}>{!file && required && t('NavForm.validateRequired')}</p>

                <textarea
                  name="shortDescription"
                  value={values.shortDescription}
                  onChange={handleChange}
                  placeholder="short description for file"
                  className={
                    !!errors.shortDescription && touched.shortDescription
                      ? styles.shortDescription__error
                      : styles.shortDescription
                  }
                />

                {!!errors.shortDescription && touched.shortDescription && (
                  <div className={styles.error_wrap}>
                    <FormError nameError="shortDescription" />
                  </div>
                )}

                {progressUpload >= 1 && !(valuesFields === tAnotherForm('uploadFile')) && (
                  <ProgressBar value={progressUpload} />
                )}

                {valuesFields !== '' && <Alerts valueFields={valuesFields} />}

                <div className={styles.buttons}>
                  <Dialog.CloseTrigger onClick={closePreviewPhoto}>
                    {t('DeletionFile.cancelButton')}
                  </Dialog.CloseTrigger>
                  <button type="submit">{t('Description.submit')}</button>
                </div>
              </Form>
            )}
          </Formik>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
};
