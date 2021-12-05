import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import useSWR from "swr";

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './index.module.scss';

type ResetType = {
  email: string;
};

const initialValues = {
  email: '',
};

export default function Reset({ email }: ResetType, { resetForm }: any) {
  
  const router = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data } = useSWR(`/languages/${router.locale}.json`, fetcher);
  
  const reset__password = async () => {
    try {
      const res= await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        email,
      })
        console.log('Your user received an email:', res);
      resetForm(initialValues);
    } catch (error) {
      // @ts-ignore
      console.log('An error occurred:', error.response);
    }
  }
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string().email(data?.NavForm.validateEmail).required(data?.NavForm.validateRequired),
        
      })}
      onSubmit={reset__password}
    >
      <Form className={styles.forgotten}>
        <h2 className={styles.title}>Did you forget your password?</h2>
        <h3 className={styles.subtitle}>Please enter your e-mail.</h3>
        
        <FormField
          titleField={`${data?.NavForm?.email}:`}
          nameField='email'
          typeField='email'
          placeholderField={data?.NavForm?.email}
        />
        
        <FormError className={styles.error} nameError='email' />
        
        <button
          type='submit'
          className={`button ${styles.submit__button}`}
          aria-label='login button'
        >
          {data?.NavForm?.loginSubmit}
        </button>
        
        {/*{!!valuesFields && <p className={styles.success__info}>{valuesFields}</p>}*/}
        
        {/*{!!errorMessage && <p className={styles.error}>{errorMessage}</p>}*/}
      </Form>
    </Formik>
  );
}