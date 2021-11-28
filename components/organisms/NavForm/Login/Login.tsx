import React, { FC, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from "swr";
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';

import { NavFormContext } from 'providers/NavFormProvider';
import { StatusLoginContext } from "providers/StatusLogin";

import styles from '../NavForm.module.scss';

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
  const { showUser } = useContext(StatusLoginContext);
  
  
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
        {
          withCredentials: true,
        }
      );
      
      resetForm(initialValues);
      // @ts-ignore
      setValuesFields(`${data.user.pseudonym}${data?.NavForm?.statusLogin}`);
      await router.push('/app');
      await showUser();
    } catch (error) {
      setErrorMessage(data?.MavForm?.setErrorMessageLogin);
    }
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string().email(data?.NavForm.validateEmail).required(data?.NavForm.validateRequired),
        
        password: Yup.string()
        .min(9, data?.NavForm?.validatePasswordNum)
        .matches(/[A-Z]+/g, data?.NavForm?.validatePasswordOl)
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, data?.NavForm?.validatePasswordHKik)
        .matches(/[0-9]+/g, data?.NavForm?.validatePasswordOn)
        .matches(/[#?!@$%^&*-]+/g, data?.NavForm?.validatePasswordSpec)
        .required(data?.NavForm.validateRequired),
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
        
        {!!valuesFields && <p className={styles.success__info}>{valuesFields}</p>}
        
        {!!errorMessage && <p className={styles.error}>{errorMessage}</p>}
        
        <p className={styles.separator}>__________________</p>
        
        <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleLogin}</h4>
        
        <Providers />
      </Form>
    </Formik>
  );
};
