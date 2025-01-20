'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Form, Formik } from 'formik';
import { IconButton, Input, Stack, StackSeparator } from '@chakra-ui/react';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { InputGroup } from 'components/ui/input-group';

import { useI18n, useScopedI18n } from 'locales/client';

import { ResetFormType, UserFormType } from 'types/global.types';

import { initialValuesForSignInUp } from 'constants/objects';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './FormSignUp.module.scss';
import { GrFormView, GrFormViewHide } from 'react-icons/gr';

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

      const { data } = await supabase.from('Users').select('email').eq('email', email).limit(1).maybeSingle();

      if (!data) {
        await supabase.auth.signUp({
          email,
          password: password!,
          options: {
            emailRedirectTo: `${location.origin}/${locale}/auth/callback`,
          },
        });
        setValuesFields(tNavForm('successInfoRegistration'));
        resetForm(initialValuesForSignInUp);
        setIsLoading(false);
      } else {
        setValuesFields(tNavForm('theSameEmail'));
      }
    } catch (e) {
      setValuesFields(t('error'));
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
                placeholder={tNavForm('password')}
                className={touched.password && !!errors.password ? styles.inputForm__error : styles.inputForm}
              />
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
