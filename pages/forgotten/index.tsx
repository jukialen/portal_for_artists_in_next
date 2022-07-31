import { useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { FormType, UserDataType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './index.module.scss';
import { Divider, Input } from '@chakra-ui/react';

const initialValues = {
  email: '',
};

export default function Forgotten() {
  const [valuesFields, setValuesFields] = useState<string>('');
  const data = useHookSWR();
  
  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
  });
  
  const { asPath } = useRouter();
  const auth = getAuth();
  auth.useDeviceLanguage();
  
  const actionCodeSettings = { url: `${process.env.NEXT_PUBLIC_PAGE}` };
  
  const reset__password = async ({ email }: UserDataType, { resetForm }: FormType) => {
    try {
      await sendPasswordResetEmail(auth, email!, actionCodeSettings)
      resetForm(initialValues);
      setValuesFields(data?.Forgotten?.success);
    } catch (e) {
      console.log(e);
      setValuesFields(data?.error);
    }
  };
  
  return <Formik
      initialValues={initialValues}
      validationSchema={schemaValidation}
      onSubmit={reset__password}
    >
    {({ values, handleChange, errors, touched }) => (
      <Form className={styles.forgotten}>
        <HeadCom path={asPath} content='The site for resetting password.' />
    
        <div className={styles.borderContainer}>
          <h2 className={styles.title}>{data?.Forgotten?.title}</h2>
          <Divider />
          <h3 className={styles.subtitle}>{data?.Forgotten?.subtitle}</h3>
          <Input
            name='email'
            type='email'
            value={values.email}
            onChange={handleChange}
            className={touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm}
            placeholder={data?.NavForm?.email}
          />
  
          <FormError nameError='email' />
  
          <button
            type='submit'
            className={`button ${styles.submit__button}`}
            aria-label={data?.Forgotten?.buttonAria}
          >
            {data?.AnotherForm?.send}
          </button>
  
          {!!valuesFields && <Alerts valueFields={valuesFields} />}

        </div>
      </Form>
      )}
    </Formik>
}
