import { useEffect, useState } from 'react';
import Image from 'next/image';
import { db, storage } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { DataType, EventType, FormType } from 'types/global.types';

import { useUserData } from 'hooks/useUserData';

import { FormError } from 'components/molecules/FormError/FormError';
import { InfoField } from 'components/atoms/InfoField/InfoField';

import styles from './ProfileAccount.module.scss';
import defaultAvatar from 'public/defaultAvatar.png';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UploadTaskSnapshot } from '@firebase/storage';
import { Progress } from '@chakra-ui/react';
import { Alerts } from '../../atoms/Alerts/Alerts';


type ProfileType = {
  newPseudonym: string,
  newDescription: string
}

export const ProfileAccount = ({ data }: DataType) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const { pseudonym, description } = useUserData();
  const [form, setForm] = useState(false);
  const [photoURL, setPhotoURL] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState<number>(0);
  
  const auth = getAuth();
  const user = auth.currentUser!;
  
  useEffect(() => {
    user?.photoURL && setPhotoURL(user?.photoURL);
  }, [user]);
  
  const initialValues = {
    newPseudonym: `${pseudonym}`,
    newDescription: `${description}` || '',
    photo: null
  };
  
  const schemaNew = Yup.object({
    newPseudonym: SchemaValidation().pseudonym,
    newDescription: SchemaValidation().description,
  });
  
  const handleChange = async (e: EventType) => {
    e.target.files?.[0] && setPhoto(e.target.files[0]);
  };
  
  const updatePseuAndDes = async ({ newPseudonym, newDescription }: ProfileType, { resetForm }: FormType) => {
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
          
          setValuesFields(`${data?.AnotherForm?.uploadFile}`);
          setPhoto(null);
  
          await updateDoc(doc(db, 'users', `${user?.uid}`), {
            pseudonym: newPseudonym,
            description: newDescription
          });
  
          await updateProfile(user, { photoURL: photoURL });
  
          setValuesFields(data?.NewUSer?.successSending);
        });
      
      resetForm(initialValues);
      setValuesFields(data?.Account?.profile?.successSending);
    } catch (e) {
      setValuesFields(data?.Account?.profile?.errorSending);
    }
  };
  
  return (
    <article id='profile' className={styles.profile}>
      {!form && (
        <>
          <div className={styles.photo__profile}>
            <Image
              layout='fill'
              src={photoURL ? photoURL : defaultAvatar}
              alt={photoURL ? data?.userAvatar : data?.defaultAvatar}
              aria-label={photoURL ? data?.userAvatar : data?.defaultAvatar}
              priority
            />
          </div>
          <div className={styles.pseudonym__name}>
            <label className={styles.title} htmlFor='pseudonym__name'>{data?.AnotherForm?.pseudonym}</label>
            <div id='pseudonym__name' className={styles.input}>{pseudonym}</div>
          </div>
          <div className={styles.about__me}>
            <label className={styles.title} htmlFor='about__me'>{data?.Account?.profile?.aboutMe}</label>
            <div id='about__me' className={styles.description}>{description}</div>
          </div>
        </>
      )}
      
      {form && (<Formik
        initialValues={initialValues}
        validationSchema={schemaNew}
        onSubmit={updatePseuAndDes}
      >
        <Form>
          <div className={styles.new__profile__photo}>
            <label htmlFor={data?.AnotherForm?.profilePhoto} className={styles.title}>
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
          
          <div className={styles.pseudonym__name}>
            <label className={styles.title} htmlFor='newPseudonym'>{data?.AnotherForm?.pseudonym}</label>
            <Field
              id='newPseudonym'
              className={styles.input}
              type='text'
              name='newPseudonym'
              placeholder={data?.AnotherForm?.pseudonym}
            />
          </div>
          
          <FormError nameError='newPseudonym' />
          
          <div className={styles.about__me}>
            <label className={styles.title} htmlFor='newDescription'>{data?.Account?.profile?.aboutMe}</label>
            <Field
              as='textarea'
              id='newDescription'
              className={styles.description}
              type='text'
              name='newDescription'
              placeholder={data?.Account?.profile?.aboutMe}
            />
          </div>
          
          <FormError nameError='newDescription' />
          
          {!!valuesFields && <InfoField value={valuesFields} />}
          
          <button
            className={`${styles.button} button`}
            type='submit'
            aria-label={data?.Account?.profile?.ariaLabelButton}
          >{data?.Account?.profile?.save}</button>
  
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
      </Formik>)}
      <button
        className={`button ${form ? styles.cancel : styles.edit} ${styles.mar__button}`}
        onClick={() => setForm(!form)}
      >{form ? `${data?.cancel}` : `${data?.edit}`}</button>
    </article>
  );
};
