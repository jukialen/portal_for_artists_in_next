'use client';

import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Form, Formik } from 'formik';
import { IconButton, Input, Stack, StackSeparator } from '@chakra-ui/react';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { InputGroup } from 'components/ui/input-group';

import { ResetFormType, UserFormType } from 'types/global.types';

import { initialValuesForSignInUp } from 'constants/objects';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './FormSignUp.module.scss';
import { GrFormView, GrFormViewHide } from 'react-icons/gr';

export const FormSignUp = ({
  translated,
}: {
  translated: {
    successInfoRegistration: string;
    theSameEmail: string;
    titleOfRegistration: string;
    email: string;
    password: string;
    createSubmit: string;
    loadingRegistration: string;
    error: string;
  };
}) => {
  const supabase = createClient();

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

      const { data, error } = await supabase.auth.signUp({
        email,
        password: password!,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });

      console.log('data', data);
      console.log('error', error);
      if (!!error) {
        if (
          error.message.includes('User already registered') ||
          error.message.includes('User already exists') ||
          error.message === 'Email not confirmed'
        ) {
          setValuesFields(translated.theSameEmail);
        } else {
          setValuesFields(translated.error);
        }
        setIsLoading(false);
        return;
      }

      setValuesFields(translated.successInfoRegistration);
      resetForm(initialValuesForSignInUp);
      setIsLoading(false);
    } catch (e) {
      setValuesFields(translated.error);
      setIsLoading(false);
    }
  };

  return (
    <Formik initialValues={initialValuesForSignInUp} validationSchema={schemaValidation} onSubmit={registration}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>{translated.titleOfRegistration}</h2>

          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder={translated.email}
            className={touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm}
          />

          <FormError nameError="email" />

          <Stack separator={<StackSeparator />}>
            <InputGroup
              flex="1"
              endElement={
                <IconButton className={styles.showingPass} onClick={showPass} aria-label="show and hide password">
                  {show ? <GrFormView /> : <GrFormViewHide />}
                </IconButton>
              }>
              <Input
                name="password"
                type={show ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                placeholder={translated.password}
                className={touched.password && !!errors.password ? styles.inputForm__error : styles.inputForm}
              />
            </InputGroup>
          </Stack>

          <FormError nameError="password" />

          <button type="submit" className={`button ${styles.submit__button}`} aria-label="login button">
            {isLoading ? translated.loadingRegistration : translated.createSubmit}
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
