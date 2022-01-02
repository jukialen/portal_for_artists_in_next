import { useCallback, useContext, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../../firebase';

import { FormError } from 'components/molecules/FormError/FormError';
import { FormField } from 'components/molecules/FormField/FormField';
import { Providers } from 'components/molecules/Providers/Providers';
import { InfoField } from 'components/atoms/InfoField/InfoField';

import { NavFormContext } from 'providers/NavFormProvider';

import styles from '../NavForm.module.scss';
import { useRouter } from 'next/router';

type UserDataType = {
  email: string,
  password: string
}

const initialValues = {
  email: '', password: '',
};

export const Create = ({ data }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valuesFields, setValuesFields] = useState<string>('');
  const { locale } = useRouter();
  
  const { isCreate } = useContext(NavFormContext);
  
  const actionCodeSettings = { url: `${process.env.NEXT_PUBLIC_PAGE}` };
  
  const submitAccountData = useCallback(async ({
    email,
    password
  }: UserDataType, { resetForm }) => {
    auth.useDeviceLanguage();
    setIsLoading(true);
    console.log('api key', process.env.NEXT_PUBLIC_API_KEY);
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      resetForm(initialValues);
      // @ts-ignore
      sendEmailVerification(auth.currentUser, actionCodeSettings);
      setValuesFields(data?.NavForm?.successInfoRegistration);
    })
    .catch((error) => {
      error.code === 'auth/email-already-in-use' && setValuesFields(data?.NavForm?.theSameEmail);
      setValuesFields(data?.NavForm?.setErrorMessageCreate);
    });
    setIsLoading(false);
  }, [data?.NavForm?.setErrorMessageCreate, data?.NavForm?.successInfoRegistration]);
  
  // @ts-ignore
  return (
    <div className={`${styles.create__account} ${isCreate ? styles.form__menu__active : ''}`}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
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
        <Form>
          <h2 className={styles.title}>{data?.NavForm?.titleOfRegistration}</h2>
          
          <FormField
            titleField={`${data?.NavForm?.email}:`}
            nameField='email'
            typeField='email'
            placeholderField={data?.NavForm?.email}
          />
          
          <FormError nameError='email' />
          
          <FormField
            titleField={`${data?.NavForm?.password}:`}
            nameField='password'
            typeField='password'
            placeholderField={data?.NavForm?.password}
          />
          
          <FormError nameError='password' />
          
          <button
            type='submit'
            className={`button ${styles.submit__button}`}
            aria-label='login button'
          >
            {isLoading ? data?.NavForm?.loadingRegistration : data?.NavForm?.createSubmit}
          </button>
  
          {!!valuesFields && <InfoField value={valuesFields} />}
        </Form>
      </Formik>
      <p className={styles.separator}>__________________</p>
  
      <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleRegistration}</h4>
  
      <Providers />
      <p className={styles.acceptInfo}>{data?.NavForm?.acceptInfoOne}
        <a href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '/terms' : `/${locale}/terms`}`}>{data?.NavForm?.acceptInfoTwo}</a>
        {data?.NavForm?.acceptInfoThree}
        <a href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '/privacy' : `/${locale}/privacy`}`}>{data?.NavForm?.acceptInfoFour}</a>
      </p>
    </div>
  
  );
};
