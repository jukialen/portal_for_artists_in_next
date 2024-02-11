'use client';

import { useState } from 'react';
import { redirect } from "next/navigation";
import { Form, Formik } from 'formik';
import { IconButton, Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { useI18n, useScopedI18n } from "locales/client";

import { ResetFormType, UserFormType } from 'types/global.types';

import { initialValuesForSignInUp } from 'constants/objects';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './FormSignUp.module.scss';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const FormSignUp = ({ locale }: { locale: string }) => {
  const supabase = createClientComponentClient();
  
  const t = useI18n();
  const tNavForm = useScopedI18n('NavForm');

  const [isLoading, setIsLoading] = useState(false);
  const [valuesFields, setValuesFields] = useState('');
  const [show, setShow] = useState(false);
  
  const showPass = () => setShow(!show);

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    password: SchemaValidation().password,
  });

  const registration = async ({ email, password }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      setIsLoading(true);
      // const exist = await doesEmailExist({ email });

      // if (exist.doesExist) {
      //   setValuesFields(tNavForm('theSameEmail'));
      
        // return null;
      // }
      
      console.log('lo', location.origin)
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password!,
        options: {
          emailRedirectTo: `${location.origin}/${locale}/auth/callback`
        }
      });

      // await supabase

      console.log('d', data);
      console.log('e', error);
      // setValuesFields(error?.message === 'Error sending confirmation mail' ? "Nieprawidłowy adress email. Nie można wysłać potwierdzenia emaila" : t('error'));
      
      data.user && setValuesFields(tNavForm('successInfoRegistration'));
      !!error && setValuesFields(error?.message)
      //   resetForm(initialValuesForSignInUp);
      setIsLoading(false);
      
      // if (response.status === 'FIELD_ERROR') {
      //   response.formFields.forEach((formField: { id: string; error: string }) => {
      //     setValuesFields(formField.error === tNavForm('theSameEmail') ? tNavForm('theSameEmail') : formField.error);
      //     return null;
      //   });
      // } else {
      //   // const res = await sendVerificationEmail();
      //
      //   if (res.status === 'EMAIL_ALREADY_VERIFIED_ERROR') {
      //     resetForm(initialValuesForSignInUp);
      //     setIsLoading(false);
      //     return null;
      //   } else {
      //     resetForm(initialValuesForSignInUp);
      //     setValuesFields(tNavForm('successInfoRegistration'));
      //     setIsLoading(false);
      //     return null;
      //   }
      // }
    } catch (e: any) {
      console.error('e2', e);
      // setValuesFields(e.msg === 'Error sending confirmation mail' ? "Nieprawidłowy adress email. Nie można wysłać potwierdzenia emaila" : t('error'));
      setIsLoading(!isLoading);
    }
  };

  return (
    <Formik initialValues={initialValuesForSignInUp} validationSchema={schemaValidation} onSubmit={registration}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>{tNavForm('titleOfRegistration')}</h2>

          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder={tNavForm('email')}
            className={touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm}
          />

          <FormError nameError="email" />

          <Stack spacing={4}>
            <InputGroup>
              <Input
                name="password"
                type={show ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                placeholder={tNavForm('password')}
                className={touched.password && !!errors.password ? styles.inputForm__error : styles.inputForm}
              />
              <InputRightElement>
                <IconButton
                  className={styles.showingPass}
                  onClick={showPass}
                  icon={show ? <ViewIcon /> : <ViewOffIcon />}
                  aria-label="show and hide password"
                />
              </InputRightElement>
            </InputGroup>
          </Stack>

          <FormError nameError="password" />

          <button type="submit" className={`button ${styles.submit__button}`} aria-label="login button">
            {isLoading ? tNavForm('loadingRegistration') : tNavForm('createSubmit')}
          </button>

          {!!valuesFields && (
            <div className={styles.chakraAlert}>
              <Alerts valueFields={valuesFields} />
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};
