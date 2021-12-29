import { useState } from 'react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { InfoField } from 'components/atoms/InfoField/InfoField';

import styles from './index.module.scss';

type ResetType = {
  email: string;
};

const initialValues = {
  email: '',
};

export default function Forgotten() {
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const reset__password = async ({ email }: ResetType, { resetForm }: any) => {
    try {
      const res = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        email,
      });
      console.log('Your user received an email:', res);
      resetForm(initialValues);
      setValuesFields('Sprawdź skrzynkę e-mailową');
    } catch (error) {
      // @ts-ignore
      console.log('An error occurred:', error.response);
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