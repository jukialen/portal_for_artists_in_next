import { DataType, FormType, UserDataType } from 'types/global.types';

import styles from './MailAccountData.module.scss';
import { getAuth, updateEmail } from 'firebase/auth';
import { useHookSWR } from '../../../hooks/useHookSWR';
import { FormError } from '../FormError/FormError';
import { Alerts } from '../../atoms/Alerts/Alerts';
import { useState } from 'react';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from '../../../shemasValidation/schemaValidation';

const initialValues = {
  email: '',
};

export const MailAccountData = ({ data }: DataType) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
  });
  
  const auth = getAuth();
  
  const update__email = async ({ email }: UserDataType, { resetForm }: FormType) => {
    try {
      await updateEmail(auth.currentUser!, email!);
      resetForm(initialValues);
      setValuesFields(data?.Forgotten?.success);
    } catch (e) {
      setValuesFields(data?.error);
    }
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schemaValidation}
      onSubmit={update__email}
    >
      <Form className={styles.form}>
        <label className={styles.title} htmlFor='mail__change'>{data?.NavForm?.email}</label>
        
        <Field
          name='email'
          type='email'
          placeholder={useHookSWR()?.NavForm?.email}
          className={styles.input}
        />
        
        <FormError nameError='email' />
        
        <button
          id='mail__change'
          className={`${styles.button} button`}
          type='submit'
          aria-label='E-mail adress change'
        >
          {data?.Account?.aData?.changeEmail}
        </button>
        
        {!!valuesFields && <Alerts valueFields={valuesFields} />}
      </Form>
    </Formik>
  );
};
