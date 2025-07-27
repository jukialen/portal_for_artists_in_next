'use client';

import { useContext, useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Upload } from 'tus-js-client';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Input, Button, Textarea } from '@chakra-ui/react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { NativeSelectField, NativeSelectRoot } from 'components/ui/native-select';
import { ProgressValueText, ProgressRoot } from 'components/ui/progress';

import { useI18n, useScopedI18n } from 'locales/client';

import { access_token, bucketName, darkMode, projectId } from 'constants/links';
import { Tags, EventType, ResetFormType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import { FormError } from 'components/atoms/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

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

export const FilesUpload = ({ userId }: { userId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const [required, setRequired] = useState(false);
  const [open, setOpen] = useState(false);

  const { isMode } = useContext(ModeContext);

  const supabase = createClient();
  const tAnotherForm = useScopedI18n('AnotherForm');
  const tAside = useScopedI18n('Aside');
  const t = useI18n();

  const schemaFile = Yup.object({
    tags: SchemaValidation().tags,
    shortDescription: SchemaValidation().shortDescription,
  });

  const handleChangeFile = async (e: EventType) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setRequired(false);
    } else {
      setFile(null);
      setRequired(true);
    }
  };
  const uploadFiles = async ({ tags, shortDescription }: FileDataType, { resetForm }: ResetFormType) => {
    try {
      if (!file || !tags) {
        setRequired(true);
        return;
      }

      if (
        file.size < 6291456 &&
        (file.type === 'image/jpg' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === ' image/webp' ||
          file.type === 'image/avif' ||
          file.type === 'video/mp4' ||
          file.type === 'video/webm')
      ) {
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
      } else if (
        file.size > 6291456 &&
        (file.type === 'image/jpg' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === ' image/webp' ||
          file.type === 'image/avif' ||
          file.type === 'video/mp4' ||
          file.type === 'video/webm')
      ) {
        return new Promise<void>(async (resolve, reject) => {
          let upload = new Upload(file, {
            endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
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
      setFile(null);
      setRequired(false);
      resetForm(initialValues);
    } catch (e) {
      console.error(e);
      setValuesFields(tAnotherForm('notUploadFile'));
    }
  };

  return (
    <DialogRoot
      lazyMount
      open={open}
      onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button aria-label="new logo" colorScheme="blue" className={styles.updateLogo} onClick={() => setOpen(true)}>
          {t('newFile')}
          <MdUploadFile size="1.4rem" />
        </Button>
      </DialogTrigger>

      <DialogContent className={`${isMode === darkMode ? styles.darkModalContent : ''} ${styles.modelContent}`}>
        <DialogHeader>
          <DialogTitle>New logo</DialogTitle>
        </DialogHeader>
        <DialogBody className={styles.modal}>
          <Formik initialValues={initialValues} validationSchema={schemaFile} onSubmit={uploadFiles}>
            {({ values, handleChange, errors, touched }) => (
              <Form className={styles.adding__files}>
                <h3 className={styles.title}>{tAnotherForm('fileTitle')}</h3>

                <div className={isMode === darkMode ? styles.select__dark : styles.select}>
                  <NativeSelectRoot
                    onChange={handleChange}
                    className={!!errors.tags && touched.tags ? styles.tags__error : styles.tags}
                    backgroundColor="#red"
                    aria-required>
                    <NativeSelectField name="tags" value={values.tags}>
                      <option role="option" value="">
                        {t('chooseTag')}
                      </option>
                      <option role="option" value="realistic">
                        {tAside('realistic')}
                      </option>
                      <option role="option" value="manga">
                        {tAside('manga')}
                      </option>
                      <option role="option" value="anime">
                        {tAside('anime')}
                      </option>
                      <option role="option" value="comics">
                        {tAside('comics')}
                      </option>
                      <option role="option" value="photographs">
                        {tAside('photographs')}
                      </option>
                      <option role="option" value="videos">
                        {tAside('videos')}
                      </option>
                      <option role="option" value="animations">
                        {tAside('animations')}
                      </option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </div>

                <FormError nameError="tags" />

                <Input
                  name="file"
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp, .avif, .gif, .mp4, .webm"
                  onChange={handleChangeFile}
                  placeholder={tAnotherForm('file')}
                  className={!file && required ? styles.input__error : styles.input}
                />

                <p className={styles.error}>{!file && required && t('NavForm.validateRequired')}</p>

                <Textarea
                  name="shortDescription"
                  value={values.shortDescription}
                  onChange={handleChange}
                  placeholder="short description for file"
                  className={`
                    ${
                      !!errors.shortDescription && touched.shortDescription
                        ? styles.shortDescription__error
                        : styles.shortDescription
                    }
                    ${isMode === darkMode ? styles.shortDescription__dark : ''}
                    `}
                />

                {!!errors.shortDescription && touched.shortDescription && (
                  <div className={styles.error_wrap}>
                    <FormError nameError="shortDescription" />
                  </div>
                )}

                {progressUpload >= 1 && !(valuesFields === tAnotherForm('uploadFile')) && (
                  <ProgressRoot
                    defaultValue={0}
                    colorScheme="green"
                    animated
                    striped
                    bg="blue.400"
                    className={styles.progressbar}>
                    <ProgressValueText>{progressUpload}</ProgressValueText>
                  </ProgressRoot>
                )}

                {valuesFields !== '' && <Alerts valueFields={valuesFields} />}

                <div className={styles.buttons}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    borderColor="transparent"
                    mr={3}
                    onClick={() => setOpen(false)}>
                    {t('DeletionFile.cancelButton')}
                  </Button>
                  <Button type="submit" colorScheme="yellow" borderColor="transparent">
                    {t('Description.submit')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogBody>
        <DialogCloseTrigger className={styles.closeButton} />
      </DialogContent>
    </DialogRoot>
  );
};
