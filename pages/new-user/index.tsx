import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db, storage } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { UploadTaskSnapshot } from '@firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Input, Progress } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { EventType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/molecules/FormError/FormError';

import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './index.module.scss';

type FirstDataType = {
  username: string,
  pseudonym: string,
}

export default function NewUser() {
  const [valuesFields, setValuesFields] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState<number>(0);
  
  const { push, asPath } = useRouter();
  const loading = useCurrentUser('/');
  const data = useHookSWR();
  const { showUser } = useContext(StatusLoginContext);
  
  const user = auth.currentUser!;
  
  const initialValues = {
    username: '',
    pseudonym: ''
  };
  
  const schemaValidation = Yup.object({
    username: SchemaValidation().username,
    pseudonym: SchemaValidation().pseudonym,
  });
  
  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] && setPhoto(e.target.files[0]);
  };
  
  const sendingData = async ({ username, pseudonym }: FirstDataType) => {
    try {
      const fileRef = await ref(storage, `profilePhotos/${user?.uid}/${photo?.name}`);
      
      const upload = uploadBytesResumable(fileRef, photo!);
      
      upload.on('state_changed', (snapshot: UploadTaskSnapshot) => {
          const progress: number = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressUpload(progress);
          switch (snapshot.state) {
            case 'running':
              setValuesFields('Upload is running');
              break;
            case 'paused':
              setValuesFields('Upload is paused');
              break;
          }
        }, (e) => {
          console.error(e);
          setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
        },
        async () => {
          const photoURL = await getDownloadURL(fileRef);
  
          await setDoc(doc(db, 'users', `${user?.uid}`), {
            pseudonym, profilePhoto: photoURL
          });
      
          setValuesFields(`${data?.AnotherForm?.uploadFile}`);
          setPhoto(null);
  
          await updateProfile(user, {
            displayName: username, photoURL: photoURL
          });
  
          setValuesFields(data?.NewUSer?.successSending);
          await showUser();
          return push('/app');
        });
    } catch (error) {
      setValuesFields(data?.NewUser?.errorSending)
    }
  };
  
  return !loading ? (
  <>
    <HeadCom path={asPath} content='The first addition of data by a new user.' />
    
    <Formik
      initialValues={initialValues}
      validationSchema={schemaValidation}
      onSubmit={sendingData}
    >
      {({ values, handleChange }) => (
        <Form className={styles.first__data}>
        <h2 className={styles.title}>{data?.NewUser?.title}</h2>
  
        <Input
          name='username'
          type='text'
          value={values.username}
          onChange={handleChange}
          placeholder={data?.NewUser?.name}
        />
        
        <FormError nameError='username' />
        
        <Input
          name='pseudonym'
          type='text'
          value={values.pseudonym}
          onChange={handleChange}
          placeholder={data?.AnotherForm?.pseudonym}
        />
        
        <FormError nameError='pseudonym' />
  
          <Input
            name='profilePhoto'
            type='file'
            accept='.jpg, .jpeg, .png, .webp, .avif'
            onChange={handleChangeFile}
            placeholder={data?.AnotherForm?.profilePhoto}
            className={styles.input}
          />
        
        <FormError nameError='profilePhoto' />
        
        <button
          type='submit'
          className={`button ${styles.submit__button}`}
          aria-label={data?.NewUser?.ariaLabelButtom}
        >
          {data?.AnotherForm?.send}
        </button>
  
        { progressUpload >= 1 && !(valuesFields ===`${data?.AnotherForm?.uploadFile}`) &&
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
  
        {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
      </Form>
        )}
    </Formik>
  </>
) : null;
}

