import { useContext, useState } from 'react';
import { auth, storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytesResumable, UploadTask } from 'firebase/storage';
import { UploadTaskSnapshot } from '@firebase/storage';
import { addDoc, CollectionReference } from 'firebase/firestore';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Input, Progress, Select } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { userAnimationsRef, userPhotosRef, userVideosRef } from 'references/referencesFirebase';

import { EventType, FormType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './FileUpload.module.scss';
import { ModeContext } from '../../../providers/ModeProvider';

type FileDataType = {
  tags: string
};

const initialValues = {
  description: '',
  tags: ''
};

export const FilesUpload = () => {
  const [file, setFile] = useState<Blob | Uint8Array | ArrayBuffer | File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);
  
  const { isMode } = useContext(ModeContext);
  const data = useHookSWR();
  
  const user = auth.currentUser;
  
  const tagsArray = [
    data?.Aside?.realistic,
    data?.Aside?.manga,
    data?.Aside?.anime,
    data?.Aside?.comics,
    data?.Aside?.photographs,
    data?.Aside?.videos,
    data?.Aside?.animations,
    data?.Aside?.others
  ];
  
  const schemaFile = Yup.object({
    tags: SchemaValidation().tags,
  });
  
  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] && setFile(e.target.files[0]);
  };
  
  const uploadFiles = async ({ tags }: FileDataType, { resetForm }: FormType) => {
    try {
      // @ts-ignore
      const photosRef = ref(storage, `${user?.uid}/photos/${file?.name}`);
      // @ts-ignore
      const videosRef = ref(storage, `${user?.uid}/videos/${file?.name}`);
      // @ts-ignore
      const animationsRef = ref(storage, `${user?.uid}/animations/${file?.name}`);
    
      let upload: UploadTask;
    
      switch (tags) {
        case `${data?.Aside?.animations}`:
          upload = uploadBytesResumable(animationsRef, file!);
          break;
        case `${data?.Aside?.videos}`:
          upload = uploadBytesResumable(videosRef, file!);
          break;
        default:
          upload = uploadBytesResumable(photosRef, file!);
      }
    
      let refName: string;
    
      upload.on('state_changed', (snapshot: UploadTaskSnapshot) => {
          const progress: number = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressUpload(progress);
        
          switch (snapshot.state) {
            case 'running':
              setValuesFields('Upload is running');
              return refName = snapshot.ref.name;
            case 'paused':
              setValuesFields('Upload is paused');
              break;
          }
        }, (e) => {
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
              uid: user?.uid
            });
            setValuesFields(`${data?.AnotherForm?.uploadFile}`);
            setFile(null);
            resetForm(initialValues);
          };
        
          switch (tags) {
            case `${data?.Aside?.animations}`:
              const animationURL = await getDownloadURL(animationsRef);
              sendToFirestore(userAnimationsRef(user?.uid!), animationURL);
              break;
            case `${data?.Aside?.videos}`:
              const videoURL = await getDownloadURL(videosRef);
              sendToFirestore(userVideosRef(user?.uid!), videoURL);
              break;
            default:
              const photoURL = await getDownloadURL(photosRef);
              sendToFirestore(userPhotosRef(user?.uid!), photoURL);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schemaFile}
      onSubmit={uploadFiles}
    >
      {({ values, handleChange }) => (
        <Form className={styles.adding__files}>
          <h3 className={styles.title}>{data?.AnotherForm?.fileTitle}</h3>
        
          <div className={styles.select}>
            <Select
              name='tags'
              value={values.tags}
              onChange={handleChange}
              placeholder={data?.chooseTag}
              className={isMode ? styles.tags__dark : styles.tags}
              aria-required
            >
              {tagsArray.map((tag: string) => <option
                role='option'
                key={tag}
                value={tag === data?.chooseTag ? '' : tag}
              >{tag}</option>)}
            </Select>
          </div>
        
          <FormError nameError='tags' />
        
          <Input
            name='file'
            type='file'
            accept='.jpg, .jpeg, .png, .webp, .avif'
            onChange={handleChangeFile}
            placeholder={data?.AnotherForm?.file}
            focusBorderColor='transparent'
            className={styles.input}
            required
          />
          
          <button
            type='submit'
            className={`button ${styles.button}`}
            aria-label={data?.AnotherForm?.arialSendingFile}
          >
            {data?.AnotherForm?.send}
          </button>
        
          {progressUpload >= 1 && !(valuesFields === `${data?.AnotherForm?.uploadFile}`) &&
          <Progress
            value={progressUpload}
            colorScheme='green'
            isAnimated
            hasStripe
            min={0}
            max={100}
            bg='blue.400'
            size='md'
            className={styles.progressbar}
          />
          }
        
          {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};