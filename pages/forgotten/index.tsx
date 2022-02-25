import { useState } from 'react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { InfoField } from 'components/atoms/InfoField/InfoField';

import styles from './index.module.scss';
import { getAuth, sendPasswordResetEmail, updatePassword } from 'firebase/auth';

type ResetType = {
  email: string;
};

const initialValues = {
  email: '',
};

export default function Forgotten() {
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const auth = getAuth();
  
  const actionCodeSettings = { url: `${process.env.NEXT_PUBLIC_PAGE}` };
  
  const reset__password = async ({ email }: ResetType, { resetForm }: any) => {
    try {
      const forgotPass = await sendPasswordResetEmail(auth, email, actionCodeSettings)
      console.log('Your user received an email:', forgotPass);
      resetForm(initialValues);
      setValuesFields('Sprawdź skrzynkę e-mailową');
    } catch (e: any) {
      console.log(`An error occurred: error: ${e.code}, ${e.message}`);
      setValuesFields('Spróbuj ponownie lub lub sprawdź połączenie z internetem');
      
    }
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string().email(useHookSWR()?.NavForm.validateEmail).required(useHookSWR()?.NavForm.validateRequired),
      })}
      onSubmit={reset__password}
    >
      <Form className={styles.forgotten}>
        <h2 className={styles.title}>Did you forget your password?</h2>
        <h3 className={styles.subtitle}>Please enter your e-mail.</h3>
        
        <FormField
          titleField={`${useHookSWR()?.NavForm?.email}:`}
          nameField='email'
          typeField='email'
          placeholderField={useHookSWR()?.NavForm?.email}
        />
        
        <FormError nameError='email' />
        
        <button
          type='submit'
          className={`button ${styles.submit__button}`}
          aria-label='button for forgotten password'
        >
          Wyślij
        </button>
  
        {!!valuesFields && <InfoField value={valuesFields} />}
      
      </Form>
    </Formik>
  );
}
