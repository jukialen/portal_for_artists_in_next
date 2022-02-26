import { useState } from 'react';
import { getAuth, updatePassword } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { DataType, FormType } from 'types/global.types';

import { FormError } from 'components/molecules/FormError/FormError';
import { InfoField } from 'components/atoms/InfoField/InfoField';

import styles from './PasswordAccountData.module.scss';
import { Alerts } from 'components/atoms/Alerts/Alerts';

const initialValues = {
  newPassword: '',
  repeatNewPassword: ''
};

type ResetPassword = {
  newPassword: string,
  repeatNewPassword: string
};

export const PasswordAccountData = ({ data }: DataType) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const auth = getAuth();
  
  auth.useDeviceLanguage();
  const user = auth.currentUser!;
  
  const schemaValidation = Yup.object({
    newPassword: SchemaValidation().password,
    repeatNewPassword: SchemaValidation().password,
  });
  
  const newPassword = async ({ newPassword, repeatNewPassword }: ResetPassword, { resetForm }: FormType) => {
    try {
      if (newPassword !== repeatNewPassword) {
        setValuesFields(data?.PasswordAccount?.differentPasswords);
        return;
      }
      
      await updatePassword(user, newPassword);
      resetForm(initialValues);
      setValuesFields(data?.PasswordAccount?.success);
    } catch (e) {
      setValuesFields(data?.error);
    }
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schemaValidation}
      onSubmit={newPassword}
    >
      <Form className={styles.form}>
        <label className={styles.title} htmlFor='password'>{data?.NavForm?.password}</label>
        
        <Field
          name='newPassword'
          type='password'
          placeholder={data?.Account?.aData?.newPassword}
          className={styles.button}
        />
        <FormError nameError='newPassword' />
        
        <Field
          name='repeatNewPassword'
          type='password'
          placeholder={data?.Account?.aData?.againNewPassword}
          className={styles.input}
        />
        
        <FormError nameError='repeatNewPassword' />
        
        <button className={`${styles.button} button`} type='submit' aria-label={data?.PasswordAccount?.buttonAria}>
          {data?.Account?.aData?.changePassword}
        </button>
        
        {!!valuesFields && <Alerts valueFields={valuesFields} />}
      </Form>
    </Formik>
  );
};
