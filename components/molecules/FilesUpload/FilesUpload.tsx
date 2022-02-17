import { useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UploadTaskSnapshot } from '@firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db, storage } from '../../../firebase';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { EventType, FormType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormError } from 'components/molecules/FormError/FormError';

import styles from './FileUpload.module.scss';
import { Alert, AlertIcon, Progress } from '@chakra-ui/react';
import { LoadingOutlined, PauseCircleTwoTone, ReloadOutlined } from '@ant-design/icons';

type FileDataType = {
  tags: string
};

const initialValues = {
  description: '',
  tags: ''
};

export const FilesUpload = () => {
  const [photo, setPhoto] = useState<Blob | Uint8Array | ArrayBuffer | File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const data = useHookSWR();
  
  const user = auth.currentUser;
  
  const tagsArray = [`${data?.chooseTag}`,
                    `${data?.Aside?.realistic}`,
                    `${data?.Aside?.manga}`,
                    `${data?.Aside?.anime}`,
                    `${data?.Aside?.comics}`,
                    `${data?.Aside?.photographs}`,
                    `${data?.Aside?.animations}`,
                    `${data?.Aside?.others}`
                    ];
  
  const schemaFile = Yup.object({
    tags: Yup.string().required(data?.NavForm?.validateRequired),
    file: Yup.string().required(data?.NavForm?.validateRequired),
  });
  
  const handleChange = async (e: EventType) => {
    e.target.files?.[0] && setPhoto(e.target.files[0]);
  };
  
  // @ts-ignore
  const photosRef = ref(storage, `${user?.uid}/photos/${photo?.name}`);
  
  const uploadFiles = async ({ tags }: FileDataType, { resetForm }: FormType) => {
    const upload = uploadBytesResumable(photosRef, photo!);
    
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
      }, (e: Error) => {
        console.log(e);
        setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
      },
      async () => {
        const photoURL = await getDownloadURL(photosRef);
        
        await addDoc(collection(db, `users/${user?.uid}/photos`), {
          photoURL,
          description: refName,
          tag: tags,
          timeCreated: Date.now()
        });
        
        setValuesFields(`${data?.AnotherForm?.uploadFile}`);
        resetForm(initialValues);
        setPhoto(null);
      });
  };
  
  const switchAlert = (value:string) => {
    let status: string;
    
    switch (value) {
      case `${data?.AnotherForm?.uploadFile}`:
        return status='success';
      case 'Upload is running':
        return status='info';
      case 'Upload is paused':
        return status='warning'
      case `${data?.AnotherForm?.notUploadFile}`:
        return status='error';
    };
  };
  
  const switchAlertColor = (value:string) => {
    let color: string;
    
    switch (value) {
      case `${data?.AnotherForm?.uploadFile}`:
        return color='green';
      case 'Upload is running':
        return color='blue';
      case 'Upload is paused':
        return color='yellow'
      case `${data?.AnotherForm?.notUploadFile}`:
        return color='red';
    };
  };
  
  // const pauseUpload = uploadBytesResumable(photosRef, photo!).pause();
  // const resumeUpload = uploadBytesResumable(photosRef, photo!).resume();
  // const cancelUpload = uploadBytesResumable(photosRef, photo!).cancel();
  
  const managedUpload = (state: string) => {
    switch (state) {
      case 'PAUSE':
        uploadBytesResumable(photosRef, photo!).pause();
        console.log(' Blob | Uint8Array | ArrayBuffer');
        break;
      case 'RESUME':
        uploadBytesResumable(photosRef, photo!).resume();
        console.log('File is resumed.');
        break;
      case 'CANCEL':
        uploadBytesResumable(photosRef, photo!).cancel();
        console.log('File is canceled.');
        break;
      default:
        console.error(`${state} match nothing`);
    }
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schemaFile}
      onSubmit={uploadFiles}
    >
      <Form className={styles.adding__files}>
        <h3 className={styles.title}>Adding a file</h3>
        
        <Field name='tags' as='select' className={styles.tags} aria-required='true'>
          {tagsArray.map(tag => <option
            key={tag}
            value={tag === data?.chooseTag ? '' : tag}
            className={styles.options}
          >{tag}</option>)}
        </Field>
        
        <FormError nameError='tags' />
        
        <div className={styles.form__field}>
          <label htmlFor={data?.AnotherForm?.profilePhoto} className={styles.label}>
            {data?.AnotherForm?.file}
          </label>
          <Field
            name='file'
            type='file'
            accept='.jpg, .jpeg, .png, .webp, .avif'
            onChange={handleChange}
            placeholder={data?.AnotherForm?.file}
            className={styles.input}
          />
        </div>
        
        <FormError nameError='file' />
        
        <button
          type='submit'
          className={`button ${styles.button}`}
          aria-label={data?.AnotherForm?.arialSendingFile}
        >
          {data?.AnotherForm?.send}
        </button>
        
        { progressUpload >= 1 &&
        <Progress
          value={progressUpload}
          colorScheme='green'
          isAnimated
          hasStripe
          min={0}
          max={100}
          w={280}
          bg='blue.400'
          m='1.5rem auto'
          size='md'
        />
        }
  
        {valuesFields !== '' &&
        <Alert
          colorScheme={switchAlertColor(valuesFields)}
          color='blackAlpha.900'
          size='sm'
          margin='1rem auto'
          width='17.5rem'
          status={switchAlert(valuesFields)}
          variant='left-accent'
        >
          <AlertIcon />
          {valuesFields}
        </Alert>}
        
        <div>
          <PauseCircleTwoTone className={styles.icons} onClick={() => managedUpload('PAUSE')} />
          <ReloadOutlined className={styles.icons} onClick={() => managedUpload('RESUME')} />
          <LoadingOutlined className={styles.icons} onClick={() => managedUpload('CANCEL')} />
        </div>
      </Form>
    </Formik>
  );
};