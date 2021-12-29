import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, updateMetadata, uploadBytes } from "firebase/storage";

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { InfoField } from 'components/atoms/InfoField/InfoField';

import { StatusLoginContext } from "providers/StatusLogin";

import styles from './index.module.scss';

type FirstDataType = {
  username: string,
  pseudonym: string,
  profilePhoto: File
}

export default function NewUser() {
  const { push } = useRouter();
  
  const loading = useCurrentUser('/');
  const data = useHookSWR();
  
  const { showUser } = useContext(StatusLoginContext);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [photo, setPhoto] = useState(null);
  
  const initialValues = {
    username: '',
    pseudonym: ''
  };
  
  const user = auth.currentUser;
  
  const handleChange = async (e: any) => {
    e.target.files[0] && setPhoto(e.target.files[0]);
  };
  
  const sendingData = async({ username, profilePhoto, pseudonym }: FirstDataType) => {
    try {
      await setDoc(doc(db, "users", `${user?.uid}`), { pseudonym });
      const fileRef = ref(storage, `profilePhotos/${user?.uid}`);
      
      const photoURL = await getDownloadURL(fileRef);
  
      const metadata = {
        contentType: `${photo?.type}`,
      };
      
      uploadBytes(fileRef, photo).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        updateMetadata(fileRef, metadata);
      });
      
      // @ts-ignore
      await updateProfile(user, {
        displayName: username, photoURL: photoURL
      });

      localStorage.setItem('uD', `${pseudonym}`);
      setValuesFields(data?.NewUSer?.successSending);
      await showUser();
      return push('/app');
    } catch (error) {
      setValuesFields(data?.NewUser?.errorSending)
    }
  };
  return !loading ? (
  <div className='workspace'>
    <Formik // @ts-ignore
      initialValues={initialValues}
      validationSchema={Yup.object({
        username: Yup.string()
        .matches(/^[A-Z]/g, data?.NavForm?.validateUsernameFl)
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, data?.NavForm?.validateUsernameHKik)
        .matches(/\D/g, data?.NavForm?.validateUsernameNum)
        .min(3, data?.NavForm?.validateUsernameMin)
        .required(data?.NavForm?.validateRequired),
  
        pseudonym: Yup.string()
        .matches(/[0-9０-９]+/g, data?.NavForm?.validatePseudonymNum)
        .matches(/[#?!@$%^&*-＃？！＄％＆＊ー]+/g, data?.NavForm?.validatePseudonymSpec)
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, data?.NavForm?.validatePseudonymHKik)
        .min(5, data?.NavForm?.validatePseudonymMin)
        .max(15, data?.NavForm?.validatePseudonymMax)
        .required(data?.NavForm?.validateRequired),
      })}
      onSubmit={sendingData}
    >
      <Form className={styles.first__data}>
        <h2 className={styles.title}>Dodaj swoje imię i pseudonym:</h2>
  
        <FormField
          titleField={`${data?.NavForm?.name}:`}
          nameField='username'
          typeField='text'
          placeholderField={data?.NavForm?.name}
        />
        
        <FormError nameError='username' />
        
        <FormField
          titleField={`${data?.Account?.profile?.pseudonym}:`}
          nameField='pseudonym'
          typeField='text'
          placeholderField={data?.Account?.profile?.pseudonym}
        />
        
        <FormError nameError='pseudonym' />
  
        <div className={styles.form__field}>
          <label htmlFor={data?.NavForm?.profilePhoto} className={styles.label}>
            {data?.NavForm?.profilePhoto}:
          </label>
          <Field
            name='profilePhoto'
            type='file'
            id='profilePhoto'
            accept='.jpg, .jpeg, .png, .webp, .avif'
            onChange={handleChange}
            placeholder={data?.NavForm?.profilePhoto}
            className={styles.input}
          />
        </div>
        
        <FormError nameError='profilePhoto' />
        
        <button
          type='submit'
          className={`button ${styles.submit__button}`}
          aria-label={data?.NewUser?.ariaLabelButtom}
        >
          {data?.NewUser?.send}
        </button>
  
        {!!valuesFields && <InfoField value={valuesFields} />}
      </Form>
    </Formik>
  </div>
) : null;
}

