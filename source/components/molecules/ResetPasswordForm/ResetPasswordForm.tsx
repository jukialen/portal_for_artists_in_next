'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitNewPassword } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'source/shemasValidation/schemaValidation';
import { Divider, Input } from '@chakra-ui/react';

import { FormError } from 'source/components/molecules/FormError/FormError';
import { Alerts } from 'source/components/atoms/Alerts/Alerts';

import styles from './ResetPasswordForm.module.scss';

type ResetPasswordType = {
  newPassword: string;
  repeatPassword: string;
};

type ResetPassTrType = {
  reset: {
    wrongValues: string,
    failed: string,
    success: string,
    unknownError: string,
    title: string,
    subtitle: string,
    newPassword: string,
    againNewPassword: string,
    buttonAria: string,
    changePassword: string,
  },
  locale: string
}

export const ResetPasswordForm = ({ reset, locale }: ResetPassTrType ) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const { push } = useRouter();
  
  const initialValues = {
    newPassword: '',
    repeatPassword: '',
  };
  
  const schemaValidation = Yup.object({
    newPassword: SchemaValidation().password,
    repeatPassword: SchemaValidation().password,
  });

  const newPasswordEntered = async ({ newPassword, repeatPassword }: ResetPasswordType) => {
    try {
      if (newPassword !== repeatPassword) {
        setValuesFields(reset.wrongValues);
        return null;
      } else {
        const response = await submitNewPassword({ formFields: [{ id: 'password', value: newPassword }] });

        if (response.status === 'FIELD_ERROR') {
          response.formFields.forEach((formField) => formField.id === 'password' && setValuesFields(formField.error));
        } else if (response.status === 'RESET_PASSWORD_INVALID_TOKEN_ERROR') {
          setValuesFields(reset.failed);
          push(`${locale}/`);
        } else {
          setValuesFields(reset.success);
          push(`${locale}/`);
        }
      }
    } catch (e: any) {
      console.error(e);
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : reset.unknownError);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={newPasswordEntered}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.reset}>
          <div className={styles.borderContainer}>
            <h2 className={styles.title}>{reset.title}</h2>
            <Divider />
            <h3 className={styles.subtitle}>{reset.subtitle}</h3>
            <Input
              name="newPassword"
              type="password"
              value={values.newPassword}
              onChange={handleChange}
              className={touched.newPassword && !!errors.newPassword ? styles.inputForm__error : styles.inputForm}
              placeholder={reset.newPassword}
            />

            <FormError nameError="newPassword" />

            <Input
              name="repeatPassword"
              type="password"
              value={values.repeatPassword}
              onChange={handleChange}
              className={touched.repeatPassword && !!errors.repeatPassword ? styles.inputForm__error : styles.inputForm}
              placeholder={reset.againNewPassword}
            />

            <FormError nameError="repeatPassword" />

            <button
              type="submit"
              className={`button ${styles.submit__button}`}
              aria-label={reset.buttonAria}>
              {reset.changePassword}
            </button>

            {!!valuesFields && <Alerts valueFields={valuesFields} />}
          </div>
        </Form>
      )}
    </Formik>
  );
};
