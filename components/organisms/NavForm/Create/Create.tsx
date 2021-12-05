import { useCallback, useContext, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import useSWR from "swr";

import { FormError } from 'components/molecules/FormError/FormError';
import { FormField } from 'components/molecules/FormField/FormField';
import { Providers } from 'components/molecules/Providers/Providers';

import { NavFormContext } from 'providers/NavFormProvider';

import styles from '../NavForm.module.scss';

const initialValues = {
  username: '', pseudonym: '', email: '', password: '',
};

type UserDataType = {
  username: string; pseudonym: string; email: string; password: string;
};

// @ts-ignore
export const Create = ({ data }: any) => {
  const { isCreate } = useContext(NavFormContext);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [valuesFields, setValuesFields] = useState<boolean>(false);
  
  const submitAccountData = useCallback(async ({
    username,
    pseudonym,
    email,
    password
  }: UserDataType, { resetForm }) => {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_CREATE_USER}`, {
        username, pseudonym, email, password,
      },);
      setValuesFields(!valuesFields);
      // @ts-ignore
      resetForm(initialValues);
    } catch (error) {
      setErrorMessage(data?.NavForm?.setErrorMessageCreate);
    }
    setIsLoading(false);
  }, [data?.NavForm?.setErrorMessageCreate, valuesFields],);
  
  // @ts-ignore
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        username: Yup.string()
        .matches(/^[A-Z]/g, data?.NavForm?.validateUsernameFl)
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, data?.NavForm?.validateUsernameHKik)
        .matches(/\D/g, data?.NavForm?.validateUsernameNum)
        .min(3, data?.NavForm?.validateUsernameMin)
        .required(data?.NavForm?.validateRequired),
        
        pseudonym: Yup.string()
        .matches(/[0-9０-９]+/g, data?.NavForm?.validatePseudonymNum)
        .matches(/[#?!@$%^&*-]+/g, data?.NavForm?.validatePseudonymSpec)
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, data?.NavForm?.validatePseudonymHKik)
        .min(5, data?.NavForm?.validatePseudonymMin)
        .max(15, data?.NavForm?.validatePseudonymMax)
        .required(data?.NavForm?.validateRequired),
        
        email: Yup.string().email(data?.NavForm?.validateEmail).required(data?.NavForm?.validateRequired),
        
        password: Yup.string()
        .min(9, data?.NavForm?.validatePasswordNum)
        .matches(/[A-Z]+/g, data?.NavForm?.validatePasswordOl)
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, data?.NavForm?.validatePasswordHKik)
        .matches(/[0-9]+/g, data?.NavForm?.validatePasswordOn)
        .matches(/[#?!@$%^&*-]+/g, data?.NavForm?.validatePasswordSpec)
        .required(data?.NavForm?.validateRequired),
      })}
      onSubmit={submitAccountData}
    >
      <Form className={`${styles.create__account} ${isCreate ? styles.form__menu__active : ''}`}>
        <h2 className={styles.title}>{data?.NavForm?.titleOfRegistration}</h2>
        
        <FormField
          titleField={`${data?.NavForm?.name}:`}
          nameField='username'
          typeField='text'
          placeholderField={data?.NavForm?.name}
        />
        
        <FormError className={styles.error} nameError='username' />
        
        <FormField
          titleField={`${data?.NavForm?.pseudonym}:`}
          nameField='pseudonym'
          typeField='text'
          placeholderField={data?.NavForm?.pseudonym}
        />
        
        <FormError className={styles.error} nameError='pseudonym' />
        
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
          {isLoading ? data?.NavForm?.loadingRegistration : data?.NavForm?.createSubmit}
        </button>
        
        {valuesFields && (<p className={styles.success__info}>
          {data?.NavForm?.successInfoRegistration}
        </p>)}
        
        {!!errorMessage && <p className={styles.error}>{errorMessage}</p>}
        
        <p className={styles.separator}>__________________</p>
        
        <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleRegistration}</h4>
        
        <Providers />
      </Form>
    </Formik>
  );
};
