import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db, storage } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { UploadTaskSnapshot } from '@firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { EventType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './index.module.scss';
import { Progress } from '@chakra-ui/react';

type FirstDataType = {
  username: string,
  pseudonym: string,
}

export default function NewUser() {
  const { push } = useRouter();
  
  const loading = useCurrentUser('/');
  const data = useHookSWR();
  
  const { showUser } = useContext(StatusLoginContext);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState<number>(0);
  
  const initialValues = {
    username: '',
    pseudonym: ''
  };
  
  const schemaValidation = Yup.object({
    username: SchemaValidation().username,
    pseudonym: SchemaValidation().pseudonym,
  });
  
  const user = auth.currentUser!;
  
  const handleChange = async (e: EventType) => {
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
        }, (e: Error) => {
          console.error(e);
          setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
        },
        async () => {
          const photoURL = await getDownloadURL(fileRef);
  
          await setDoc(doc(db, 'users', `${user?.uid}`), { pseudonym });
      
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
  <div className='workspace'>
    <Formik
      initialValues={initialValues}
      validationSchema={schemaValidation}
      onSubmit={sendingData}
    >
      <Form className={styles.first__data}>
        <h2 className={styles.title}>{data?.NewUser?.title}</h2>
  
        <FormField
          titleField={data?.NewUser?.name}
          nameField='username'
          typeField='text'
          placeholderField={data?.NewUser?.name}
        />
        
        <FormError nameError='username' />
        
        <FormField
          titleField={data?.AnotherForm?.pseudonym}
          nameField='pseudonym'
          typeField='text'
          placeholderField={data?.AnotherForm?.pseudonym}
        />
        
        <FormError nameError='pseudonym' />
  
        <div className={styles.form__field}>
          <label htmlFor={data?.AnotherForm?.profilePhoto} className={styles.label}>
            {data?.AnotherForm?.profilePhoto}
          </label>
          <Field
            name='profilePhoto'
            type='file'
            accept='.jpg, .jpeg, .png, .webp, .avif'
            onChange={handleChange}
            placeholder={data?.AnotherForm?.profilePhoto}
            className={styles.input}
          />
        </div>
        
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
    </Formik>
  </div>
) : null;
}

