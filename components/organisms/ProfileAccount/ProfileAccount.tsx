import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { db } from '../../../firebase';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FormError } from 'components/molecules/FormError/FormError';

import { useUserData } from 'hooks/useUserData';

import { InfoField } from 'components/atoms/InfoField/InfoField';

import defaultAvatar from 'public/defaultAvatar.png';
import styles from './ProfileAccount.module.scss';
import { getAuth } from 'firebase/auth';

type ProfileType = {
  newPseudonym: string,
  newDescription: string
}
const initialValues = {
  newPseudonym: `${localStorage.getItem('uD')}`,
  newDescription: ''
};

export const ProfileAccount = ({ data }: any) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const { pseudonym, description } = useUserData();
  const [form, setForm] = useState(false);
  const [photoURL, setPhotoURL] = useState(defaultAvatar);
  const auth = getAuth();
  const user = auth.currentUser;
  
  useEffect(() => {
    // @ts-ignore
    user?.photoURL && setPhotoURL(user?.photoURL);
  }, [user]);
  
  const schemaNew = Yup.object({
    newPseudonym: Yup.string()
    .matches(/[0-9０-９]+/g, data?.NavForm?.validatePseudonymNum)
    .matches(/[#?!@$%^&*-＃？！＄％＆＊ー]+/g, data?.NavForm?.validatePseudonymSpec)
    .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, data?.NavForm?.validatePseudonymHKik)
    .min(5, data?.NavForm?.validatePseudonymMin)
    .max(15, data?.NavForm?.validatePseudonymMax),
    newDescription: Yup.string()
    .required(data?.NavForm?.validateRequired)
  });
  
  const updatePseuAndDes = async ({ newPseudonym, newDescription }: ProfileType, { resetForm }: any) => {
    try {
      await setDoc(doc(db, 'users', `${user?.uid}`), {
        pseudonym: newPseudonym,
        description: newDescription
      });
      localStorage.setItem('uD', newPseudonym);
      resetForm(initialValues);
      setValuesFields(data?.Account?.profile?.successSending);
    } catch (e) {
      setValuesFields(data?.Account?.profile?.errorSending);
    }
  };
  
  return (
    <article id='profile' className={styles.profile}>
      <div className={styles.photo__profile}>
        <Image
          layout='fill'
          src={photoURL ? photoURL : defaultAvatar}
          alt={photoURL ? data?.userAvatar : data?.defaultAvatar}
          aria-label={photoURL ? data?.userAvatar : data?.defaultAvatar}
          priority
        />
      </div>
      
      {!form && (
        <>
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
        
        </Form>
      </Formik>)}
      <button
        className={`button ${form ? styles.cancel : styles.edit} ${styles.mar__button}`}
        onClick={() => setForm(!form)}
      >{form ? `${data?.cancel}` : `${data?.edit}`}</button>
    </article>
  );
};
