import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { doc, addDoc } from "firebase/firestore";

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';

import { StatusLoginContext } from "providers/StatusLogin";

import styles from './index.module.css';

export default function NewUser() {
  const { push } = useRouter();
  const { showUser } = useContext(StatusLoginContext);
  const loading = useCurrentUser('/');
  
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const data = useHookSWR();
  
  const initialValues = {
    username: '',
    pseudonym: ''
  };
  
  type FirstDataType = {
    username: string,
    pseudonym: string,
    profilePhoto: File
  }
  
  const sendingData = async({ username, profilePhoto, pseudonym }: FirstDataType) => {
    const user = auth.currentUser;
    console.log(profilePhoto)
  
    try {
      // @ts-ignore
      await updateProfile(auth.currentUser, {
        displayName: username, photoURL: profilePhoto
      });
      // @ts-ignore
      await addDoc(doc(db, "users", user?.uid), { pseudonym });
      await localStorage.setItem('fD', `${process.env.NEXT_APP_LSTORAGE}`);
      setValuesFields('Profile zaktualizowany');
      await showUser();
      return push('/app');
    } catch (error) {
      // @ts-ignore
      setValuesFields(`Error: ${error.code}, ${error.message}`)
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
        .matches(/[#?!@$%^&*-]+/g, data?.NavForm?.validatePseudonymSpec)
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
          typeField='username'
          placeholderField={data?.NavForm?.name}
        />
        
        <FormError className={styles.error} nameError='username' />
        
        <FormField
          titleField={`${data?.NavForm?.pseudonym}:`}
          nameField='pseudonym'
          typeField='pseudonym'
          placeholderField={data?.NavForm?.pseudonym}
        />
        
        <FormError className={styles.error} nameError='pseudonym' />
        
        <FormField
          titleField={`${data?.NavForm?.profilePhoto}:`}
          nameField='profilePhoto'
          typeField='file'
          accept='.jpg, .jpeg, .png'
          placeholderField={data?.NavForm?.profilePhoto}
        />
        
        <FormError className={styles.error} nameError='profilePhoto' />
        
        <button
          type='submit'
          className={`button ${styles.submit__button}`}
          aria-label='sending first data'
        >
          Wyślij
        </button>
        
        {!!valuesFields && <p className={styles.submit__info}>{valuesFields}</p>}
      
      </Form>
    </Formik>
  </div>
) : null;
}

