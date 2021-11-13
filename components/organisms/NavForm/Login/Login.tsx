import React, { FC, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';

import styles from '../NavForm.module.scss';

import { NavFormContext } from 'providers/NavFormProvider';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import useSWR from "swr";

type LoginType = {
  email: string;
  password: string;
};

const initialValues = {
  email: '',
  password: '',
};

export const Login: FC = () => {
  const { isLogin } = useContext(NavFormContext);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const router = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR(`/languages/${router.locale}.json`, fetcher);
  
  // @ts-ignore
  const submitAccountData = async ({ email, password }: LoginType, { resetForm }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_LOGIN_USER}`,
        {
          identifier: email,
          password,
        },
      );
      // @ts-ignore
      typeof window !== 'undefined' && localStorage.setItem('user', JSON.stringify(data.jwt));
      resetForm(initialValues);
      // @ts-ignore
      setValuesFields(`${data.user.pseudonym} zostałaś/eś zalogowana/y`);
      return router.push('/app');
    } catch (error) {
      setErrorMessage('Nie mogliśmy Cię zalogować');
    }
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        
        password: Yup.string()
        .min(9, 'Hasło jest za krótkie. Minimum 9 znaków')
        .matches(/^(?=.*?[A-Z])/, 'Hasło musi zawierać conajmniej jedną dużą literę')
        .matches(/(?=[0-9])+/g, 'Hasło musi mieć conajmniej 1 cyfrę.')
        .matches(
          /(?=.*?[#?!@$%^&*-]+)/,
          'Hasło musi zawierać conajmniej 1 znak specjalny: #?!@$%^&*-',
        )
        .required('Required'),
      })}
      onSubmit={submitAccountData}
    >
      <Form className={`${styles.login} ${isLogin ? styles.form__menu__active : ''}`}>
        <h2 className={styles.title}>{data?.NavForm?.titleOfLogin}</h2>
        
        <FormField
          titleField={`${data?.NavForm?.email}:`}
          nameField='email'
          typeField='email'
          placeholderField={data?.NavForm?.email}
        />
        
        <FormError className={styles.error} nameError='email' />
        
        <FormField
          titleField={`${data?.NavForm?.password}:`}
          nameField='password'
          typeField='password'
          placeholderField={data?.NavForm?.password}
        />
        
        <FormError className={styles.error} nameError='password' />
        
        <button
          type='submit'
          className={`button ${styles.submit__button}`}
          aria-label='login button'
        >
          {data?.NavForm?.loginSubmit}
        </button>
        
        {!!valuesFields ? <p className={styles.success__info}>{valuesFields}.</p> : null}
        
        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
        
        <p className={styles.separator}>__________________</p>
        
        <h4 className={styles.provider__title}>Lub zaloguj się za pomocą:</h4>
        
        <Providers />
      </Form>
    </Formik>
  );
};