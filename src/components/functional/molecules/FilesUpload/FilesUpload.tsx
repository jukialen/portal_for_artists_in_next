'use client';

import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Upload } from 'tus-js-client';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'schemasValidation/schemaValidation';

import { useI18n, useScopedI18n } from 'locales/client';

import { filesProfileTypes, filesTypes, MAX_PHOTO_SIZE, validateFile } from 'utils/common/files';

import { projectUrl } from 'constants/links';
import { Tags, EventType, ResetFormType, FilesUploadType, Plan } from 'types/global.types';

import { FormError } from 'components/ui/atoms/FormError/FormError';
import { Alerts } from 'components/ui/atoms/Alerts/Alerts';
import { ProgressBar } from 'components/ui/atoms/ProgressBar/ProgressBar';

import styles from './FileUpload.module.css';
import { MdUploadFile } from 'react-icons/md';

type FileDataType = {
  shortDescription: string;
  tags: Tags | '';
};

const initialValues: FileDataType = {
  shortDescription: '',
  tags: '',
};

const POPOVER_ID = 'files-upload-popover';

const TAG_KEYS = [
  'realistic',
  'manga',
  'anime',
  'comics',
  'photographs',
  'videos',
  'animations',
] as const;

export const FilesUpload = ({
  userId,
  plan,
  fileTranslated,
}: {
  userId: string;
  plan: Plan;
  fileTranslated: FilesUploadType;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const [required, setRequired] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supabase = createClient();
  const tAnotherForm = useScopedI18n('AnotherForm');
  const tAside = useScopedI18n('Aside');
  const t = useI18n();

  const schemaFile = Yup.object({
    tags: SchemaValidation().tags,
    shortDescription: SchemaValidation().shortDescription,
  });

  const selectOptions = [
    { value: '', name: t('chooseTag') },
    ...TAG_KEYS.map((key) => ({ value: key, name: tAside(key) })),
  ];

  const setChosenFile = (newFile: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(newFile);
    setPreviewUrl(newFile ? URL.createObjectURL(newFile) : null);
  };

  const closePreviewPhoto = () => setChosenFile(null);

  const handleChangeFile = async (e: EventType) => {
    const selected = e.target.files?.[0];

    setChosenFile(selected ?? null);
    setRequired(!selected);
  };

  const uploadFiles = async ({ tags, shortDescription }: FileDataType, { resetForm }: ResetFormType) => {
    try {
      if (!file || !tags) {
        setRequired(true);
        return;
      }

      if (!(await validateFile(fileTranslated, file, plan, false))) {
        const fileName = userId + '-' + Date.now() + '-' + file!.name!;
        const filePath = userId + '/' + fileName;

        const insertFileRecord = async () => {
          const { data: fileData, error: insertError } = await supabase
            .from('Files')
            .insert([{ name: fileName, shortDescription, authorId: userId, tags, fileUrl: filePath }])
            .select();

          if (!fileData || fileData.length === 0 || insertError) return false;

          const { error: roleError } = await supabase.from('Roles').insert([
            { fileId: fileData[0].fileId, role: 'AUTHOR', userId },
          ]);

          if (roleError) return false;

          return true;
        };

        if (file.size <= MAX_PHOTO_SIZE) {
          const { data, error } = await supabase.storage.from('basic').upload(`/${filePath}`, file);

          if (error || !data) {
            setValuesFields(tAnotherForm('notUploadFile'));
            return;
          }

          const saved = await insertFileRecord();
          if (!saved) {
            await supabase.storage.from('basic').remove([filePath]);
            setValuesFields(tAnotherForm('notUploadFile'));
            return;
          }
        } else {
          return new Promise<void>(async (resolve, reject) => {
            const {
              data: { session },
            } = await supabase.auth.getSession();

            let upload = new Upload(file, {
              endpoint: ` ${projectUrl}/storage/v1/upload/resumable`,
              retryDelays: [0, 3000, 5000, 10000, 20000],
              headers: { authorization: `Bearer ${session?.access_token}` },
              uploadDataDuringCreation: true,
              removeFingerprintOnSuccess: true,
              metadata: {
                bucketName: 'basic',
                objectName: filePath,
                contentType: file.type,
                cacheControl: '3600',
              },
              chunkSize: 6 * 1024 * 1024,
              onError: function (error) {
                setValuesFields(tAnotherForm('notUploadFile'));
                reject(error);
              },
              onProgress: function (bytesUploaded, bytesTotal) {
                let percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                setProgressUpload(parseInt(percentage));
              },
              onSuccess: async function () {
                setProgressUpload(100);
                const saved = await insertFileRecord();
                if (!saved) {
                  setValuesFields(tAnotherForm('notUploadFile'));
                  return;
                }
                setValuesFields(tAnotherForm('uploadFile'));
                resolve();
              },
            });

            const previousUploads = await upload.findPreviousUploads();
            if (previousUploads.length) upload.resumeFromPreviousUpload(previousUploads[0]);

            upload.start();
          });
        }
      } else {
        setValuesFields(tAnotherForm('notUploadFile'));
      }

      setValuesFields(tAnotherForm('uploadFile'));
      closePreviewPhoto();
      setRequired(false);
      resetForm(initialValues);
    } catch (e) {
      setValuesFields(tAnotherForm('notUploadFile'));
    }
  };

  return (
    <div className={styles.filesUploadRoot}>
      <button
        aria-label="new logo"
        className={styles.updateLogo}
        popoverTarget={POPOVER_ID}
        popoverTargetAction="toggle"
      >
        <MdUploadFile className={styles.icon} />
        {t('newFile')}
      </button>

      <div
        popover="auto"
        id={POPOVER_ID}
        className={styles.modelContent}
      >
        <div className={styles.modelContentHeader}>
          <h2>{tAnotherForm('fileTitle')}</h2>
        </div>

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

              <label className={styles.filePickerButton}>
                {tAnotherForm('file')}
                <input
                  name="file"
                  type="file"
                  accept={`${filesProfileTypes}, ${filesTypes}`}
                  onChange={handleChangeFile}
                  className={styles.visuallyHidden}
                />
              </label>

              {!!previewUrl && <img src={previewUrl} alt="preview new logo" className={styles.filePickerImage} />}

              <p className={styles.error}>{!file && required && t('NavForm.validateRequired')}</p>

              <textarea
                name="shortDescription"
                value={values.shortDescription}
                onChange={handleChange}
                placeholder={tAnotherForm('shortDescription')}
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
                <button
                  type="button"
                  onClick={closePreviewPhoto}
                  popoverTarget={POPOVER_ID}
                  popoverTargetAction="hide"
                >
                  {t('DeletionFile.cancelButton')}
                </button>
                <button type="submit">{t('Description.submit')}</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
