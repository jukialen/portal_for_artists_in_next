import { useContext, useState } from 'react';
import { auth, storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytesResumable, UploadTask } from 'firebase/storage';
import { UploadTaskSnapshot } from '@firebase/storage';
import { addDoc, CollectionReference } from 'firebase/firestore';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Input, Progress, Select } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { ModeContext } from 'providers/ModeProvider';

import { userAnimationsRef, userPhotosRef, userVideosRef } from 'config/referencesFirebase';

import { EventType, FormType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './FileUpload.module.scss';

type FileDataType = {
  tags: string;
};

const initialValues = {
  description: '',
  tags: '',
};

export const FilesUpload = () => {
  const [file, setFile] = useState<Blob | Uint8Array | ArrayBuffer | File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const [required, setRequired] = useState(false);

  const { isMode } = useContext(ModeContext);
  const data = useHookSWR();

  const user = auth.currentUser;

  const schemaFile = Yup.object({
    tags: SchemaValidation().tags,
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

  const uploadFiles = async ({ tags }: FileDataType, { resetForm }: FormType) => {
    try {
      // @ts-ignore
      const photosRef = ref(storage, `${user?.uid}/photos/${file?.name}`);
      // @ts-ignore
      const videosRef = ref(storage, `${user?.uid}/videos/${file?.name}`);
      // @ts-ignore
      const animationsRef = ref(storage, `${user?.uid}/animations/${file?.name}`);

      !file ? setRequired(true) : setRequired(false);

      let upload: UploadTask;

      switch (tags) {
        case 'animations':
          upload = uploadBytesResumable(animationsRef, file!);
          break;
        case 'videos':
          upload = uploadBytesResumable(videosRef, file!);
          break;
        default:
          upload = uploadBytesResumable(photosRef, file!);
      }

      let refName: string;

      !!file &&
        !required &&
        upload.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress: number = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgressUpload(progress);

            switch (snapshot.state) {
              case 'running':
                setValuesFields('Upload is running');
                return (refName = snapshot.ref.name);
              case 'paused':
                setValuesFields('Upload is paused');
                break;
            }
          },
          (e) => {
            console.error('error', e);
            setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
          },
          async () => {
            const sendToFirestore = (colRef: CollectionReference, url: string) => {
              addDoc(colRef, {
                fileUrl: url,
                description: refName,
                tag: tags,
                timeCreated: Date.now(),
                uid: user?.uid,
              });
              setValuesFields(`${data?.AnotherForm?.uploadFile}`);
              setFile(null);
              setRequired(false);
              resetForm(initialValues);
            };

            switch (tags) {
              case 'animations':
                const animationURL = await getDownloadURL(animationsRef);
                sendToFirestore(userAnimationsRef(user?.uid!), animationURL);
                break;
              case 'videos':
                const videoURL = await getDownloadURL(videosRef);
                sendToFirestore(userVideosRef(user?.uid!), videoURL);
                break;
              default:
                const photoURL = await getDownloadURL(photosRef);
                sendToFirestore(userPhotosRef(user?.uid!), photoURL);
            }
          },
        );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaFile} onSubmit={uploadFiles}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.adding__files}>
          <h3 className={styles.title}>{data?.AnotherForm?.fileTitle}</h3>

          <div className={isMode ? styles.select__dark : styles.select}>
            <Select
              name="tags"
              value={values.tags}
              onChange={handleChange}
              placeholder={data?.chooseTag}
              className={!!errors.tags && touched.tags ? styles.tags__error : styles.tags}
              aria-required>
              <option role="option" value="">
                {data?.chooseTag}
              </option>
              <option role="option" value="realistic">
                {data?.Aside?.realistic}
              </option>
              <option role="option" value="manga">
                {data?.Aside?.manga}
              </option>
              <option role="option" value="anime">
                {data?.Aside?.anime}
              </option>
              <option role="option" value="comics">
                {data?.Aside?.comics}
              </option>
              <option role="option" value="photographs">
                {data?.Aside?.photographs}
              </option>
              <option role="option" value="videos">
                {data?.Aside?.videos}
              </option>
              <option role="option" value="animations">
                {data?.Aside?.animations}
              </option>
              <option role="option" value="others">
                {data?.Aside?.others}
              </option>
            </Select>
          </div>

          <FormError nameError="tags" />

          <Input
            name="file"
            type="file"
            accept=".jpg, .jpeg, .png, .webp, .avif"
            onChange={handleChangeFile}
            placeholder={data?.AnotherForm?.file}
            focusBorderColor="transparent"
            className={!file && required ? styles.input__error : styles.input}
          />

          <p className={styles.error}>{!file && required && data?.NavForm?.validateRequired}</p>

          <button type="submit" className={`button ${styles.button}`} aria-label={data?.AnotherForm?.arialSendingFile}>
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
              bg="blue.400"
              size="md"
              className={styles.progressbar}
            />
          )}

          {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
