import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { FormType, UserDataType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './index.module.scss';
import { Alerts } from 'components/atoms/Alerts/Alerts';
import { HeadCom } from '../../components/atoms/HeadCom/HeadCom';
import { useRouter } from 'next/router';

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
      setValuesFields(data?.error);
    }
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schemaValidation}
      onSubmit={reset__password}
    >
      <Form className={styles.forgotten}>
        <HeadCom path={asPath} content='The site for resetting password.' />
        <h2 className={styles.title}>{data?.Forgotten?.title}</h2>
        <h3 className={styles.subtitle}>{data?.Forgotten?.subtitle}</h3>
        
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
          aria-label={data?.Forgotten?.buttonAria}
        >
          {data?.AnotherForm?.send}
        </button>
  
        {!!valuesFields && <Alerts valueFields={valuesFields} />}
      
      </Form>
    </Formik>
  );
}
