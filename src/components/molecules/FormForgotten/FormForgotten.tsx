'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Divider, Input } from '@chakra-ui/react';

import { LangType, ResetFormType, UserFormType } from 'types/global.types';

import { useI18n } from 'locales/client';

import { FormError } from 'components/atoms/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './FormForgotten.module.scss';

export const FormForgotten = ({ locale }: { locale: LangType }) => {
  const [valuesFields, setValuesFields] = useState('');

  const t = useI18n();

  const supabase = createClientComponentClient();

  const initialValues = {
    email: '',
  };

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
  });

  console.log("t('Forgotten.success')", t('Forgotten.success'));
  const reset__password = async ({ email }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_PAGE}/${locale}/new-password`,
      });

      console.log('resetEmailData', data);
      console.log('resetEmailEr', error);
      if (error?.status === 200) {
        setValuesFields(error?.message!);
      }
      resetForm(initialValues);
      setValuesFields(t('Forgotten.success'));
    } catch (e: any) {
      console.error(e);
      setValuesFields(t('unknownError'));
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
