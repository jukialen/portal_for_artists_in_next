'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'source/shemasValidation/schemaValidation';
import { Divider, Input } from '@chakra-ui/react';

import { ResetFormType, UserFormType } from 'source/types/global.types';

import { useI18n } from 'source/locales/client';

import { FormError } from 'source/components/molecules/FormError/FormError';
import { Alerts } from 'source/components/atoms/Alerts/Alerts';

import styles from './FormForgotten.module.scss';

export const FormForgotten = () => {
  const [valuesFields, setValuesFields] = useState('');

  const t = useI18n();

  const initialValues = {
    email: '',
  };

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
  });

  const reset__password = async ({ email }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      const response = await sendPasswordResetEmail({ formFields: [{ id: 'email', value: email! }] });
      if (response.status === 'FIELD_ERROR') {
        response.formFields.forEach((formField) => {
          formField.id === 'email' && setValuesFields(formField.error);
        });
      } else {
        resetForm(initialValues);
        setValuesFields(t('Forgotten.success'));
      }
    } catch (e: any) {
      console.error(e);
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : t('unknownError'));
      setValuesFields(t('error'));
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={reset__password}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.forgotten}>
          <div className={styles.borderContainer}>
            <h2 className={styles.title}>{t('Forgotten.title')}</h2>
            <Divider />
            <h3 className={styles.subtitle}>{t('Forgotten.subtitle')}</h3>
            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              className={touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm}
              placeholder={t('NavForm.email')}
            />

            <FormError nameError="email" />

            <button type="submit" className={`button `} aria-label={t('Forgotten.buttonAria')}>
              {t('AnotherForm.send')}
            </button>

            {!!valuesFields && <Alerts valueFields={valuesFields} />}
          </div>
        </Form>
      )}
    </Formik>
  );
};
