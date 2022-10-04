import { useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../../firebase';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { DataType, FormType, UserDataType } from 'types/global.types';

import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import { NavFormContext } from 'providers/NavFormProvider';

import styles from '../NavForm.module.scss';
import { Divider, Input } from '@chakra-ui/react';

const initialValues = {
  email: '',
  password: '',
};

export const Create = ({ data }: DataType) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valuesFields, setValuesFields] = useState<string>('');
  const { locale } = useRouter();

  const { isCreate } = useContext(NavFormContext);

  const actionCodeSettings = { url: `${process.env.NEXT_PUBLIC_NEW_USER}` };

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    password: SchemaValidation().password,
  });

  const submitAccountData = useCallback(
    async ({ email, password }: UserDataType, { resetForm }: FormType) => {
      auth.useDeviceLanguage();
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, email!, password!)
        .then((userCredential) => {
          resetForm(initialValues);
          sendEmailVerification(auth.currentUser!, actionCodeSettings);
          setValuesFields(data?.NavForm?.successInfoRegistration);
        })
        .catch((e) => {
          console.log(e);
          e.code === 'auth/email-already-in-use'
            ? setValuesFields(data?.NavForm?.theSameEmail)
            : setValuesFields(data?.error);
        });
      setIsLoading(false);
    },
    [data?.NavForm?.theSameEmail, data?.NavForm?.successInfoRegistration],
  );

  return (
    <div className={`${styles.create__account} ${isCreate ? styles.form__menu__active : ''}`}>
      <Formik
        initialValues={initialValues}
        validationSchema={schemaValidation}
        onSubmit={submitAccountData}>
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <h2 className={styles.title}>{data?.NavForm?.titleOfRegistration}</h2>

            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder={data?.NavForm?.email}
              className={
                touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm
              }
            />

            <FormError nameError="email" />

            <Input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder={data?.NavForm?.password}
              className={
                touched.password && !!errors.password ? styles.inputForm__error : styles.inputForm
              }
            />

            <FormError nameError="password" />

            <button
              type="submit"
              className={`button ${styles.submit__button}`}
              aria-label="login button">
              {isLoading ? data?.NavForm?.loadingRegistration : data?.NavForm?.createSubmit}
            </button>

            {!!valuesFields && <Alerts valueFields={valuesFields} />}
          </Form>
        )}
      </Formik>
      <Divider width="90%" />

      <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleRegistration}</h4>

      <Providers />
      <p className={styles.acceptInfo}>
        {data?.NavForm?.acceptInfoOne}
        <a
          href={`${process.env.NEXT_PUBLIC_PAGE}${
            locale === 'en' ? '/terms' : `/${locale}/terms`
          }`}>
          {data?.NavForm?.acceptInfoTwo}
        </a>
        {data?.NavForm?.acceptInfoThree}
        <a
          href={`${process.env.NEXT_PUBLIC_PAGE}${
            locale === 'en' ? '/privacy' : `/${locale}/privacy`
          }`}>
          {data?.NavForm?.acceptInfoFour}
        </a>
      </p>
    </div>
  );
};
