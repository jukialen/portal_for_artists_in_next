import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { auth, db } from '../../../firebase';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FormError } from 'components/molecules/FormError/FormError';

import { useUserData } from 'hooks/useUserData';

import { InfoField } from 'components/atoms/InfoField/InfoField';

import defaultAvatar from 'public/defaultAvatar.png';
import styles from './ProfileAccount.module.scss';

type ProfileType = {
  newPseudonym: string,
  newDescription: string
}
const user = auth.currentUser;

export const ProfileAccount = ({ data }: any) => {
  const { pseudonym, description } = useUserData();
  console.log("phto", user?.photoURL)
  const [form, setForm] = useState(false);
  const [photoURL, setPhotoURL] = useState(defaultAvatar);
  
  useEffect(() => {
      // @ts-ignore
      user?.photoURL && setPhotoURL(user?.photoURL);
      console.log(photoURL)
    }, [photoURL]);
  console.log(pseudonym)
  
  return (
    <article id='profile' className={styles.profile}>
      <div className={styles.photo__profile}>
        <Image
          layout='fill'
          src={photoURL ? photoURL : defaultAvatar}
          alt={photoURL ? 'avatar' : 'default avatar'}
          aria-label={photoURL ? 'avatar' : 'default avatar'}
        />
      </div>
      
      {!form && (
        <>
          <div className={styles.pseudonym__name}>
            <label className={styles.title} htmlFor='pseudonym__name'>{data?.Account?.profile?.pseudonym}</label>
            <div id='pseudonym__name' className={styles.input}>{pseudonym}</div>
          </div>
          <div className={styles.about__me}>
            <label className={styles.title} htmlFor='about__me'>{data?.Account?.profile?.aboutMe}</label>
            <div id='about__me' className={styles.description}>{description}</div>
          </div>
        </>
      )}
      
      {form && <UpdateProfile data={data} pseudonym={pseudonym} />}
      <button
        className={`button ${form ? styles.cancel : styles.edit} ${styles.mar__button}`}
        onClick={() => setForm(!form)}
      >{form ? 'Cancel' : 'Edit'}</button>
    </article>
  );
};

const UpdateProfile = ({ data }: any) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const { pseudonym } = useUserData();
  
  console.log(pseudonym)
  
  const initialValues = {
    newPseudonym: `${localStorage.getItem('uD')}`,
    newDescription: ''
  };
  
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
      setValuesFields(data?.Account?.profile?.errorSending)
      console.log(e);
    }
  };
  
  return (<Formik
    initialValues={initialValues}
    validationSchema={Yup.object({
      newPseudonym: Yup.string()
      .matches(/[0-9０-９]+/g, data?.NavForm?.validatePseudonymNum)
      .matches(/[#?!@$%^&*-＃？！＄％＆＊ー]+/g, data?.NavForm?.validatePseudonymSpec)
      .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, data?.NavForm?.validatePseudonymHKik)
      .min(5, data?.NavForm?.validatePseudonymMin)
      .max(15, data?.NavForm?.validatePseudonymMax),
      newDescription: Yup.string()
      .required(data?.NavForm?.validateRequired)
    })}

    onSubmit={updatePseuAndDes}
  >
    <Form>
      <div className={styles.pseudonym__name}>
        <label className={styles.title} htmlFor='newPseudonym'>{data?.Account?.profile?.pseudonym}</label>
        <Field
          id='newPseudonym'
          className={styles.input}
          type='text'
          name='newPseudonym'
          placeholder={data?.Account?.profile?.pseudonym}
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
  </Formik>)
}
