import { DataType, FormType, UserDataType } from 'types/global.types';

import styles from './AccountData.module.scss';
import { useState } from 'react';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { Form, Formik } from 'formik';
import { Input } from '@chakra-ui/react';
import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

const initialValues = {
  email: '',
};

const initialValuesPass = {
  newPassword: '',
  repeatNewPassword: ''
};

type ResetPassword = {
  newPassword: string,
  repeatNewPassword: string
};


export const AccountData = ({ data }: DataType) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const [valuesFieldsPass, setValuesFieldsPass] = useState<string>('');
  
  const auth = getAuth();
  
  auth.useDeviceLanguage();
  const user = auth.currentUser!;
  
  const schemaValidation = Yup.object({
    newPassword: SchemaValidation().password,
    repeatNewPassword: SchemaValidation().password,
  });
  
  const update__email = async ({ email }: UserDataType, { resetForm }: FormType) => {
    try {
      await updateEmail(auth.currentUser!, email!);
      resetForm(initialValues);
      setValuesFields(data?.Forgotten?.success);
    } catch (e) {
      console.error(e);
      setValuesFields(data?.error);
    }
  };
  
  const newPassword = async ({ newPassword, repeatNewPassword }: ResetPassword, { resetForm }: FormType) => {
    try {
      if (newPassword !== repeatNewPassword) {
        setValuesFieldsPass(data?.PasswordAccount?.differentPasswords);
        return;
      }
      
      await updatePassword(user, newPassword);
      resetForm(initialValues);
      setValuesFieldsPass(data?.PasswordAccount?.success);
    } catch (e) {
      console.error(e);
      setValuesFieldsPass(data?.error);
    }
  };
  
  return (
    <article id='account__data' className={styles.account__data}>
      <form className={styles.form}>
        <label
          className={styles.title}
          htmlFor='subscription__info'
        >
          {data?.Account?.aData?.subscription}
        </label>
        <button
          id='subscription__info'
          className={`${styles.button} button`}
          aria-label='Info about subscription'
        >
          {data?.Account?.aData?.currentPlan}
        </button>
        <button
          className={`${styles.button} button`}
          aria-label='Change subscription'
        >
          {data?.Account?.aData?.changeButton}
        </button>
      </form>
      
      <Formik
        initialValues={initialValues}
        validationSchema={schemaValidation}
        onSubmit={update__email}
      >
        {({ values, handleChange }) => (
          <Form className={styles.form}>
            <label
              className={styles.title}
              htmlFor='mail__change'
            >
              {data?.NavForm?.email}
            </label>
            <Input
              name='email'
              type='email'
              value={values.email}
              onChange={handleChange}
              placeholder={data?.NavForm?.email}
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
        )}
      </Formik>
      
      <Formik
        initialValues={initialValuesPass}
        validationSchema={schemaValidation}
        onSubmit={newPassword}
      >
        {({ values, handleChange }) => (
          <Form className={styles.form}>
            <label
              className={styles.title}
              htmlFor='password'
            >
              {data?.NavForm?.password}
            </label>
            <Input
              name='newPassword'
              type='password'
              value={values.newPassword}
              onChange={handleChange}
              placeholder={data?.Account?.aData?.newPassword}
              className={styles.input}
            />
            <FormError nameError='newPassword' />
            <Input
              name='repeatNewPassword'
              type='password'
              value={values.repeatNewPassword}
              onChange={handleChange}
              placeholder={data?.Account?.aData?.againNewPassword}
              className={styles.input}
            />
            <FormError nameError='repeatNewPassword' />
            <button
              className={`${styles.button} button`}
              type='submit'
              aria-label={data?.PasswordAccount?.buttonAria}
            >
              {data?.Account?.aData?.changePassword}
            </button>
            
            {!!valuesFieldsPass && <Alerts valueFields={valuesFieldsPass} />}
          </Form>
        )}
      </Formik>
    </article>
  );
};
