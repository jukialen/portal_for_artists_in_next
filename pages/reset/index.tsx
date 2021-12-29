import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './index.module.scss';

type ResetType = {
  new__password: string;
  again__nav__password: string;
};

const initialValues = {
  new__password: '',
  again__nav__password: '',
};

export default function Reset() {
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const { push } = useRouter();
  
  
  const reset__password = async ({ new__password, again__nav__password }: ResetType, { resetForm }: any) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        code: 'privateCode', // code contained in the reset link of step 3.
        password: new__password,
        passwordConfirmation: new__password,
      });
      resetForm(initialValues);
      setValuesFields('Hasło zostało zmienione pomyślnie! Możesz teraz zalogować się nowym hasłem.');
      return push('/');
    } catch (error) {
      console.log('Error:', error);
    }
    
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        new__password: Yup.string()
        .min(9, useHookSWR()?.NavForm?.validatePasswordNum)
        .matches(/[A-Z]+/g, useHookSWR()?.NavForm?.validatePasswordOl)
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, useHookSWR()?.NavForm?.validatePasswordHKik)
        .matches(/[0-9]+/g, useHookSWR()?.NavForm?.validatePasswordOn)
        .matches(/[#?!@$%^&*-]+/g, useHookSWR()?.NavForm?.validatePasswordSpec)
        .required(useHookSWR()?.NavForm.validateRequired),
        
        again__nav__password: Yup.string()
        .min(9, useHookSWR()?.NavForm?.validatePasswordNum)
        .matches(/[A-Z]+/g, useHookSWR()?.NavForm?.validatePasswordOl)
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, useHookSWR()?.NavForm?.validatePasswordHKik)
        .matches(/[0-9]+/g, useHookSWR()?.NavForm?.validatePasswordOn)
        .matches(/[#?!@$%^&*-]+/g, useHookSWR()?.NavForm?.validatePasswordSpec)
        .required(useHookSWR()?.NavForm.validateRequired),
      })}
      onSubmit={reset__password}
    >
      <Form className={styles.reset}>
        <h2 className={styles.title}>{useHookSWR()?.NavForm?.titleOfLogin}</h2>
        
        <FormField
          titleField='New password:'
          nameField='nav__password'
          typeField='nav__password'
          placeholderField={useHookSWR()?.Account?.aData?.newPassword}
        />
        
        <FormError nameError='nav__password' />
        
        <FormField
          titleField='Again new password:'
          nameField='again__nav__password'
          typeField='again__nav__password'
          placeholderField={useHookSWR()?.Account?.aData?.againNewPassword}
        />
        
        <FormError nameError='again__nav__password' />
        
        <button
          type='submit'
          className={`button ${styles.submit__button}`}
          aria-label='button for changing password'
        >
          {useHookSWR()?.Account?.aData?.changePassword}
        </button>
        
        {!!valuesFields && <p className={styles.success__info}>{valuesFields}</p>}
      </Form>
    </Formik>
  );
};
