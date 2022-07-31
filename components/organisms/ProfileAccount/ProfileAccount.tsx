import { useEffect, useState } from 'react';
import Image from 'next/image';
import { db, storage } from '../../../firebase';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UploadTaskSnapshot } from '@firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Input, Progress, Textarea } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { DataType, EventType, FormType } from 'types/global.types';

import { useUserData } from 'hooks/useUserData';

import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './ProfileAccount.module.scss';
import defaultAvatar from 'public/defaultAvatar.png';

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
    newPseudonym: pseudonym,
    newDescription: description,
    photo: null
  };
  
  const schemaNew = Yup.object({
    newPseudonym: SchemaValidation().pseudonym,
    newDescription: SchemaValidation().description,
  });
  
  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] && setPhoto(e.target.files[0]);
  };
  
  const fileRef = ref(storage, `profilePhotos/${user?.uid}/${user?.uid}`);
  
  const updateProfileData = async ({ newPseudonym, newDescription }: ProfileType, { resetForm }: FormType) => {
    try {
      photo === null && await updateDoc(doc(db, `users/${user.uid}`), {
        pseudonym: newPseudonym,
        description: newDescription
      });
      
      if (photo !== null) {
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
            console.log(e);
            setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
          },
          async () => {
            const photoURL = await getDownloadURL(fileRef);
      
            setValuesFields(`${data?.AnotherForm?.uploadFile}`);
            setPhoto(null);
      
            await updateDoc(doc(db, `users/${user.uid}`), {
              pseudonym: newPseudonym,
              description: newDescription,
              profilePhoto: photoURL
            });
      
            await updateProfile(user, { photoURL: photoURL });
          });
      }
      
      resetForm(initialValues);
      setValuesFields(data?.Account?.profile?.successSending);
    } catch (e) {
      console.log(e);
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
          <div className={styles.publicContainer}>
            <label className={styles.title} htmlFor='pseudonym__name'>{data?.AnotherForm?.pseudonym}</label>
            <div id='pseudonym__name' className={styles.input}>{pseudonym}</div>
          </div>
          <div className={styles.publicContainer}>
            <label className={styles.title} htmlFor='about__me'>{data?.Account?.profile?.aboutMe}</label>
            <div id='about__me' className={styles.description}>{description}</div>
          </div>
        </>
      )}
      
      {form && (<Formik
        initialValues={initialValues}
        validationSchema={schemaNew}
        onSubmit={updateProfileData}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <div className={styles.container}>
              <label htmlFor={data?.AnotherForm?.profilePhoto} className={styles.title}>
                {data?.AnotherForm?.profilePhoto}
              </label>
              <Input
                name='profilePhoto'
                type='file'
                accept='.jpg, .jpeg, .png, .webp, .avif'
                onChange={handleChangeFile}
              placeholder={data?.AnotherForm?.profilePhoto}
              className={styles.input}
            />
          </div>
  
          <FormError nameError='profilePhoto' />
          
          <div className={styles.container}>
            <label className={styles.title} htmlFor='newPseudonym'>{data?.AnotherForm?.pseudonym}</label>
            <Input
              id='newPseudonym'
              name='newPseudonym'
              value={values.newPseudonym}
              onChange={handleChange}
              placeholder={data?.AnotherForm?.pseudonym}
              className={!!errors.newPseudonym && touched.newPseudonym ? styles.input__error : styles.input}
            />
          </div>
          
          <FormError nameError='newPseudonym' />
          
          <div className={styles.container}>
            <label className={styles.title} htmlFor='newDescription'>{data?.Account?.profile?.aboutMe}</label>
            <Textarea
              id='newDescription'
              name='newDescription'
              value={values.newDescription}
              onChange={handleChange}
              placeholder={data?.Account?.profile?.aboutMe}
              className={!!errors.newDescription && touched.newDescription ? styles.description__error : styles.description}
            />
          </div>
          
          <FormError nameError='newDescription' />
          
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
            )}
      </Formik>)}
      <button
        className={`button ${form ? styles.cancel : styles.edit} ${styles.mar__button}`}
        onClick={() => setForm(!form)}
      >{form ? `${data?.cancel}` : `${data?.edit}`}</button>
    </article>
  );
};
