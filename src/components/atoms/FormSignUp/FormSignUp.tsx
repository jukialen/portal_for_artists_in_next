'use client';

import { useState } from 'react';
import { Form, Formik } from 'formik';
import { IconButton, Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';
import { doesEmailExist, emailPasswordSignUp } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { sendVerificationEmail } from 'supertokens-web-js/recipe/emailverification';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { useI18n, useScopedI18n } from "locales/client";

import { ResetFormType, UserFormType } from 'types/global.types';

import { initialValuesForSignInUp } from 'constants/objects';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './FormSignUp.module.scss';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export const FormSignUp = () => {
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
      const exist = await doesEmailExist({ email });

      if (exist.doesExist) {
        setValuesFields(tNavForm('theSameEmail'));
        resetForm(initialValuesForSignInUp);
        setIsLoading(false);
        return null;
      }

      const response = await emailPasswordSignUp({
        formFields: [
          { id: 'email', value: email! },
          { id: 'password', value: password! },
        ],
      });

      if (response.status === 'FIELD_ERROR') {
        response.formFields.forEach((formField: { id: string; error: string }) => {
          setValuesFields(formField.error === tNavForm('theSameEmail') ? tNavForm('theSameEmail') : formField.error);
          return null;
        });
      } else {
        const res = await sendVerificationEmail();

        if (res.status === 'EMAIL_ALREADY_VERIFIED_ERROR') {
          resetForm(initialValuesForSignInUp);
          setIsLoading(false);
          return null;
        } else {
          resetForm(initialValuesForSignInUp);
          setValuesFields(tNavForm('successInfoRegistration'));
          setIsLoading(false);
          return null;
        }
      }
    } catch (e: any) {
      console.error('e', e);
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : t('error'));
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
